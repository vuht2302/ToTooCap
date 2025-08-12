import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Box, Button, Paper, Stack, Tooltip, IconButton, Typography, Slider } from '@mui/material';
import { TextFields, UploadFile, ColorLens, DeleteOutline, Save, Backspace, ZoomIn, ZoomOut, CenterFocusStrong } from '@mui/icons-material';
import { FabricJSCanvas, useFabricJSEditor } from 'fabricjs-react';
import baseHat from '../../../assets/image_non.png';
import oneSticker from '../../../assets/stickers/1.webp';
import CloudinaryService from '../../../services/cloudinary.service';
import { apiUrl } from '@/config/api';

// A simpler, local-first hat designer: one canvas, base hat image, add text/image, color and save to localStorage.
export default function HatDesignPage() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const location = useLocation();
  const { editor, onReady } = useFabricJSEditor();

  const fileInputRef = useRef(null);
  const [fontSize, setFontSize] = useState(20);
  const [color, setColor] = useState('#000000');
  const [initialized, setInitialized] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  const [zoom, setZoom] = useState(1);
  const stickers = [
    { id: 'one', src: oneSticker, name: 'Sticker 1' },
  ];

  const STORAGE_JSON_KEY = `hatDesign:json:${productId || 'default'}`;
  const STORAGE_IMG_KEY = `hatDesign:image:${productId || 'default'}`;

  // Helper: compute scale & position so hat always fully visible & centered
  const layoutBaseHat = (canvas, img) => {
    const cw = canvas.getWidth();
    const ch = canvas.getHeight();
    // Leave some vertical & horizontal margin (10%)
    const maxW = cw * 0.7; // allow bigger on wide screens
    const maxH = ch * 0.75; // keep some space for overlay UI
    const scale = Math.min(maxW / img.width, maxH / img.height);
    const left = (cw - img.width * scale) / 2;
    const top = (ch - img.height * scale) / 2;
    img.set({
      scaleX: scale,
      scaleY: scale,
      left,
      top,
    });
  };

  // Add the base hat image (unselectable & auto-resized on viewport changes)
  const addBaseHat = (canvas) => {
    if (!canvas) return;
    window.fabric.Image.fromURL(
      baseHat,
      (img) => {
        img.set({
          selectable: false,
          evented: false,
          name: 'baseHat',
          isBaseHat: true,
          _autoLayout: true, // flag so we can re-layout on resize
        });
        layoutBaseHat(canvas, img);
        canvas.add(img);
        canvas.sendToBack(img);
        canvas.renderAll();
      },
      { crossOrigin: 'anonymous' }
    );
  };

  const ensureBaseAtBack = () => {
    if (!editor?.canvas) return;
    const canvas = editor.canvas;
    const objs = canvas.getObjects();
    objs.forEach((o) => {
      if (o.name === 'baseHat' || o.isBaseHat) {
        canvas.sendToBack(o);
      }
    });
    canvas.renderAll();
  };

  const loadFromLocal = async () => {
    if (!editor?.canvas) return;
    const canvas = editor.canvas;
    try {
      const savedJson = localStorage.getItem(STORAGE_JSON_KEY);
      if (savedJson) {
        canvas.clear();
        await new Promise((resolve) => canvas.loadFromJSON(savedJson, resolve));
        ensureBaseAtBack();
        canvas.renderAll();
      } else {
        canvas.clear();
        addBaseHat(canvas);
      }
    } catch {
      canvas.clear();
      addBaseHat(canvas);
    }
  };

  const handleAddText = () => {
    if (!editor?.canvas) return;
    // Use IText so user can double-click to edit
    const text = new window.fabric.IText('Nhập chữ...', {
      left: editor.canvas.getWidth() / 2,
      top: editor.canvas.getHeight() / 2,
      originX: 'center',
      originY: 'center',
      fontFamily: 'Arial',
      fontSize,
      fill: color,
    });
    editor.canvas.add(text);
    editor.canvas.setActiveObject(text);
    editor.canvas.renderAll();
  };

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file || !editor?.canvas) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      window.fabric.Image.fromURL(ev.target.result, (img) => {
        const cw = editor.canvas.getWidth();
        const ch = editor.canvas.getHeight();
        const maxW = cw * 0.3;
        const maxH = ch * 0.3;
        const scale = Math.min(maxW / img.width, maxH / img.height, 1);
        img.set({
          scaleX: scale,
          scaleY: scale,
          left: cw / 2,
          top: ch / 2,
          originX: 'center',
          originY: 'center',
          cornerStyle: 'circle',
          transparentCorners: false,
        });
        editor.canvas.add(img);
        editor.canvas.setActiveObject(img);
        editor.canvas.renderAll();
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleColorChange = (e) => {
    const val = e.target.value;
    setColor(val);
    if (!editor?.canvas) return;
    const obj = editor.canvas.getActiveObject();
    if (obj && String(obj.type).includes('text')) {
      obj.set('fill', val);
      editor.canvas.renderAll();
    }
  };

  const handleFontSizeChange = (e, v) => {
    setFontSize(v);
    if (!editor?.canvas) return;
    const obj = editor.canvas.getActiveObject();
    if (obj && String(obj.type).includes('text')) {
      obj.set('fontSize', v);
      editor.canvas.renderAll();
    }
  };

  const handleClear = () => {
    if (!editor?.canvas) return;
    editor.canvas.clear();
    addBaseHat(editor.canvas);
  };

  const addSticker = (src) => {
    if (!editor?.canvas) return;
    const cw = editor.canvas.getWidth();
    const ch = editor.canvas.getHeight();
    const maxW = cw * 0.25;
    const maxH = ch * 0.25;

    if (src.endsWith('.svg')) {
      fetch(src)
        .then((r) => r.text())
        .then((svgText) => {
          window.fabric.loadSVGFromString(svgText, (objects, options) => {
            const svg = window.fabric.util.groupSVGElements(objects, options);
            // Normalize fills/strokes for visibility
            if (svg._objects && svg._objects.length) {
              svg._objects.forEach((o) => {
                const hasFill = o.fill && o.fill !== 'none';
                const hasStroke = o.stroke && o.stroke !== 'none';
                if (!hasFill && !hasStroke) {
                  o.set({ fill: '#ffffff' });
                } else if (!hasFill && hasStroke) {
                  o.set({ stroke: '#ffffff', strokeWidth: o.strokeWidth || 2 });
                }
              });
            }
            const scale = Math.min(maxW / svg.width, maxH / svg.height, 1);
            svg.set({
              left: cw / 2,
              top: ch / 2,
              originX: 'center',
              originY: 'center',
              scaleX: scale,
              scaleY: scale,
              cornerStyle: 'circle',
              transparentCorners: false,
              name: 'sticker',
              objectCaching: false,
            });
            editor.canvas.add(svg);
            editor.canvas.bringToFront(svg);
            editor.canvas.setActiveObject(svg);
            editor.canvas.requestRenderAll();
          });
        });
    } else {
      window.fabric.Image.fromURL(
        src,
        (img) => {
          const scale = Math.min(maxW / img.width, maxH / img.height, 1);
          img.set({
            scaleX: scale,
            scaleY: scale,
            left: cw / 2,
            top: ch / 2,
            originX: 'center',
            originY: 'center',
            cornerStyle: 'circle',
            transparentCorners: false,
            name: 'sticker',
            objectCaching: false,
          });
          editor.canvas.add(img);
          editor.canvas.bringToFront(img);
          editor.canvas.setActiveObject(img);
          editor.canvas.requestRenderAll();
        },
        { crossOrigin: 'anonymous' }
      );
    }
  };

  const handleDeleteActive = () => {
    if (!editor?.canvas) return;
    const obj = editor.canvas.getActiveObject();
    if (obj && !obj.isEditing) {
      editor.canvas.remove(obj);
      editor.canvas.requestRenderAll();
    }
  };

  // Zoom functions
  const handleZoomIn = () => {
    if (!editor?.canvas) return;
    const canvas = editor.canvas;
    const newZoom = Math.min(zoom * 1.2, 3); // Max zoom 3x
    setZoom(newZoom);
    canvas.setZoom(newZoom);
    canvas.renderAll();
  };

  const handleZoomOut = () => {
    if (!editor?.canvas) return;
    const canvas = editor.canvas;
    const newZoom = Math.max(zoom / 1.2, 0.3); // Min zoom 0.3x
    setZoom(newZoom);
    canvas.setZoom(newZoom);
    canvas.renderAll();
  };

  const handleResetZoom = () => {
    if (!editor?.canvas) return;
    const canvas = editor.canvas;
    setZoom(1);
    canvas.setZoom(1);
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]); // Reset pan as well
    canvas.renderAll();
  };

  const handleSave = async () => {
    if (!editor?.canvas) return;
    const canvas = editor.canvas;

    // 1) Save JSON to localStorage (offline backup)
    try {
  const json = JSON.stringify(canvas.toJSON(['name', 'isBaseHat']));
      localStorage.setItem(STORAGE_JSON_KEY, json);
    } catch {}

    // 2) Export PNG
    let dataURL = '';
    try {
      dataURL = canvas.toDataURL({ format: 'png', quality: 0.92, multiplier: 3 });
      localStorage.setItem(STORAGE_IMG_KEY, dataURL);
    } catch {}

    // 3) Prepare payload fields
    const designName = `${location.state?.product?.name || 'Custom Hat'} - ${new Date().toLocaleDateString('vi-VN')}`;
    const colorName = 'White';
    const texts = canvas
      .getObjects()
      .filter((o) => String(o.type).includes('text'))
      .map((t) => t.text)
      .filter(Boolean);
  const textJoined = texts.join(' | ');
  const baseProductId = productId; // productId from params captured by top-level hook

    // 4) Get user id with local-first approach
    let userId = null;
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) userId = JSON.parse(storedUser)?._id;
    } catch {}
    const token = localStorage.getItem('accessToken');
    if (!userId && token) {
      try {
  const infoRes = await fetch(apiUrl('/auth/user/get/loginUser'), {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        });
        const info = await infoRes.json();
        if (infoRes.ok && info.success) userId = info.data?._id;
      } catch {}
    }

    if (!userId) {
      alert('Bạn cần đăng nhập để lưu thiết kế!');
      navigate('/login');
      return;
    }

    // 5) Upload to Cloudinary if we have an image
    let imageUrl = '';
    if (dataURL) {
      const upload = await CloudinaryService.uploadBase64Image(dataURL);
      if (upload?.success) {
        imageUrl = upload.url;
      } else {
        // Fallback to local dataURL (not ideal for server), still proceed
        imageUrl = dataURL;
      }
    }

    // 6) POST to backend (create custom design)
    try {
  const res = await fetch(apiUrl('/customDesign/add'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          design_name: designName,
          color: colorName,
          text: textJoined || 'Custom Design',
          image_url: imageUrl,
          status: true,
          user_id: userId,
          base_product_id: baseProductId,
        }),
      });
      const data = await res.json();
      if (res.ok && (data.success === undefined || data.success)) {
        // Try to extract created custom design id from various common shapes
        const createdId = data?.data?._id || data?.data?.id || data?._id || data?.id || data?.data?.customDesign?._id || null;

        if (createdId) {
          // 6b) Add this custom design to cart via provided API
          try {
            const addCartRes = await fetch(apiUrl('/cart/CartItem/custom-design/add'), {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
              body: JSON.stringify({ quantity: 1, custom_design_id: createdId }),
            });
            const addCartData = await addCartRes.json();
            if (addCartRes.ok && (addCartData.success === undefined || addCartData.success)) {
              // store cart_id if present
              const cartId = addCartData?.data?.cart_id || addCartData?.cart_id || null;
              if (cartId) localStorage.setItem('cart_id', cartId);
              // Navigate home
              navigate('/');
              return;
            } else {
              alert(addCartData.message || 'Đã lưu thiết kế nhưng không thể thêm vào giỏ hàng.');
            }
          } catch (e) {
            alert('Đã lưu thiết kế nhưng lỗi kết nối khi thêm vào giỏ hàng.');
          }
        } else {
          alert('Đã lưu thiết kế, nhưng không lấy được mã thiết kế để thêm vào giỏ hàng.');
        }
      } else {
        alert(data.message || 'Không thể lưu thiết kế lên hệ thống. Đã lưu bản nháp vào trình duyệt.');
      }
    } catch (e) {
      alert('Có lỗi khi kết nối máy chủ. Đã lưu bản nháp vào trình duyệt.');
    }

    // 7) Keep a tiny gallery list in localStorage for quick preview
    try {
      const galleryKey = 'hatDesign:gallery';
      const gallery = JSON.parse(localStorage.getItem(galleryKey) || '[]');
      const meta = {
        productId: baseProductId || null,
        name: location.state?.product?.name || 'Custom Hat',
        image: dataURL,
        updatedAt: new Date().toISOString(),
      };
      const updated = [meta, ...gallery.filter((g) => g.productId !== meta.productId)];
      localStorage.setItem(galleryKey, JSON.stringify(updated.slice(0, 20)));
    } catch {}
  };

  // Initialize and try load saved design once the editor is ready
  useEffect(() => {
    if (!editor?.canvas || initialized) return;
    const canvas = editor.canvas;
    // Size canvas to container
    const container = document.getElementById('hat-designer-canvas-box');
    const width = container ? container.clientWidth : 900;
    const height = container ? Math.max(480, Math.round((container.clientWidth * 2) / 3)) : 600;
    canvas.setWidth(width);
    canvas.setHeight(height);
    canvas.renderAll();
    setInitialized(true);
    
    // Enable mouse wheel zoom
    canvas.on('mouse:wheel', (opt) => {
      const delta = opt.e.deltaY;
      let zoom = canvas.getZoom();
      
      // Improved zoom calculation
      const zoomStep = 0.1;
      if (delta > 0) {
        zoom = Math.max(zoom - zoomStep, 0.3); // Zoom out, min 0.3x
      } else {
        zoom = Math.min(zoom + zoomStep, 3); // Zoom in, max 3x
      }
      
      setZoom(zoom);
      
      // Get mouse position relative to canvas
      const pointer = canvas.getPointer(opt.e);
      canvas.zoomToPoint(pointer, zoom);
      
      opt.e.preventDefault();
      opt.e.stopPropagation();
    });

    // Enable panning when zoomed - improved version
    let isDragging = false;
    let lastPosX = 0;
    let lastPosY = 0;

    canvas.on('mouse:down', (opt) => {
      const evt = opt.e;
      // Enable panning with middle mouse button or Ctrl/Alt + left click
      if (evt.button === 1 || evt.altKey === true || evt.ctrlKey === true) {
        isDragging = true;
        canvas.selection = false;
        canvas.defaultCursor = 'grab';
        canvas.hoverCursor = 'grab';
        lastPosX = evt.clientX;
        lastPosY = evt.clientY;
        opt.e.preventDefault();
      }
    });

    canvas.on('mouse:move', (opt) => {
      if (isDragging) {
        const e = opt.e;
        const vpt = canvas.viewportTransform;
        vpt[4] += e.clientX - lastPosX;
        vpt[5] += e.clientY - lastPosY;
        canvas.requestRenderAll();
        lastPosX = e.clientX;
        lastPosY = e.clientY;
        canvas.defaultCursor = 'grabbing';
        canvas.hoverCursor = 'grabbing';
      }
    });

    canvas.on('mouse:up', () => {
      if (isDragging) {
        canvas.setViewportTransform(canvas.viewportTransform);
        isDragging = false;
        canvas.selection = true;
        canvas.defaultCursor = 'default';
        canvas.hoverCursor = 'move';
      }
    });
    
    // default: start fresh with base hat, do not auto-restore
    addBaseHat(canvas);
    // detect if a draft exists and show a restore button
    try {
      const savedJson = localStorage.getItem(STORAGE_JSON_KEY);
      setHasDraft(!!savedJson);
    } catch {
      setHasDraft(false);
    }
    // simple responsiveness
    const onResize = () => {
      const c = document.getElementById('hat-designer-canvas-box');
      if (!c) return;
      canvas.setWidth(c.clientWidth);
      canvas.setHeight(Math.max(480, Math.round((c.clientWidth * 2) / 3)));
      // Re-layout base hat only (preserve user-added objects positions)
      const base = canvas.getObjects().find(o => o._autoLayout);
      if (base) layoutBaseHat(canvas, base);
      canvas.renderAll();
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [editor, initialized]);

  // Keyboard: Delete/Backspace removes selected object (when not typing in inputs)
  useEffect(() => {
    const onKeyDown = (e) => {
      if (!editor?.canvas) return;
      const tag = (e.target && e.target.tagName) || '';
      const isTyping = ['INPUT', 'TEXTAREA', 'SELECT'].includes(tag) || (e.target && e.target.isContentEditable);
      if (isTyping) return;
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const obj = editor.canvas.getActiveObject();
        if (obj && !obj.isEditing) {
          editor.canvas.remove(obj);
          editor.canvas.requestRenderAll();
          e.preventDefault();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [editor]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, borderBottom: '1px solid #eee' }}>
        <Button variant="outlined" onClick={() => navigate(-1)}>← Back</Button>
        <Typography fontWeight={700}>{location.state?.product?.name || 'Hat Designer'}</Typography>
        <Stack direction="row" spacing={1}>
          {hasDraft && (
            <Tooltip title="Khôi phục bản nháp trước">
              <Button size="small" variant="outlined" onClick={loadFromLocal}>Khôi phục</Button>
            </Tooltip>
          )}
          <Tooltip title="Thêm chữ">
            <IconButton onClick={handleAddText}><TextFields /></IconButton>
          </Tooltip>
          <Tooltip title="Tải ảnh lên">
            <IconButton onClick={handleUploadClick}><UploadFile /></IconButton>
          </Tooltip>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
          <Tooltip title="Đổi màu chữ">
            <IconButton component="label">
              <ColorLens />
              <input type="color" value={color} onChange={handleColorChange} style={{ display: 'none' }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Xóa đối tượng đang chọn">
            <IconButton onClick={handleDeleteActive}><Backspace /></IconButton>
          </Tooltip>
          <Tooltip title="Xóa tất cả">
            <IconButton onClick={handleClear}><DeleteOutline /></IconButton>
          </Tooltip>
          <Tooltip title="Phóng to">
            <IconButton onClick={handleZoomIn}><ZoomIn /></IconButton>
          </Tooltip>
          <Tooltip title="Thu nhỏ">
            <IconButton onClick={handleZoomOut}><ZoomOut /></IconButton>
          </Tooltip>
          <Tooltip title="Đặt lại zoom">
            <IconButton onClick={handleResetZoom}><CenterFocusStrong /></IconButton>
          </Tooltip>
          <Button variant="contained" startIcon={<Save />} onClick={handleSave}>Lưu</Button>
        </Stack>
      </Box>

      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Paper sx={{ width: 300, p: 2, borderRight: '1px solid #eee', display: { xs: 'none', md: 'block' } }} square>
          <Typography variant="subtitle2" fontWeight={700} gutterBottom>Cài đặt chữ</Typography>
          <Typography variant="caption" color="text.secondary">Kích thước</Typography>
          <Slider size="small" value={fontSize} min={10} max={96} step={1} onChange={handleFontSizeChange} sx={{ mt: 1 }} />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>Màu sắc</Typography>
          <Box sx={{ mt: 1 }}>
            <Button size="small" variant="outlined" onClick={() => handleColorChange({ target: { value: '#000000' } })} sx={{ mr: 1, textTransform: 'none' }}>Đen</Button>
            <Button size="small" variant="outlined" onClick={() => handleColorChange({ target: { value: '#ffffff' } })} sx={{ textTransform: 'none' }}>Trắng</Button>
          </Box>
          <Typography variant="subtitle2" fontWeight={700} gutterBottom sx={{ mt: 3 }}>Sticker</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
            {stickers.map((s) => (
              <Button
                key={s.id}
                onClick={() => addSticker(s.src)}
                variant="outlined"
                sx={{ p: 1, minWidth: 0, borderRadius: 2, backgroundColor: '#2b2b2b' }}
              >
                <img src={s.src} alt={s.name} style={{ width: 40, height: 40, filter: 'drop-shadow(0 0 1px rgba(0,0,0,0.4))' }} />
              </Button>
            ))}
          </Box>
          <Typography variant="subtitle2" fontWeight={700} gutterBottom sx={{ mt: 3 }}>Mẹo</Typography>
          <Typography variant="caption" color="text.secondary">
            • Kéo thả để di chuyển đối tượng<br/>
            • Giữ Shift khi kéo để tỉ lệ đều<br/>
            • <strong>Cuộn chuột để phóng to/thu nhỏ</strong><br/>
            • Giữ Ctrl/Alt + kéo hoặc nút giữa chuột để di chuyển khung nhìn<br/>
            • Double-click vào text để chỉnh sửa
          </Typography>
        </Paper>

        <Box id="hat-designer-canvas-box" sx={{ flex: 1, backgroundColor: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FabricJSCanvas onReady={onReady} style={{ width: '100%', height: '100%', background: '#fff' }} />
        </Box>
      </Box>
    </Box>
  );
}
