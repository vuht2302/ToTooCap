import React, { useEffect, useState, useContext } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  IconButton,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Sidebar from '../../components/Sidebar';
import { UserContext } from '../../context/UserContext';

export default function MyProducts() {
  const { user } = useContext(UserContext);
  const [products, setProducts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [selectedIndexes, setSelectedIndexes] = useState([]);

  const loadCart = async () => {
    const cartId = localStorage.getItem('cart_id');
    if (!cartId) return;
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`http://54.169.159.141:3000/cart/CartItem/getByCartId/${cartId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      const data = await res.json();
      if (res.ok && (data.success === undefined || data.success)) {
        const rawItems = data.data || [];
        const items = await Promise.all(
          rawItems.map(async (item) => {
            const token = localStorage.getItem('accessToken');
            const pid = item.product_id || item.product?._id;
            const cid = item.custom_design_id || item.custom_design?._id;
            let details = null;
            let isCustom = false;
            try {
              if (cid) {
                isCustom = true;
                const cRes = await fetch(`http://54.169.159.141:3000/customDesign/get/${cid}`, {
                  headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                });
                const cJson = await cRes.json();
                if (cRes.ok && (cJson.success === undefined || cJson.success)) {
                  details = cJson.data;
                }
              } else if (pid) {
                const pRes = await fetch(`http://54.169.159.141:3000/product/get/${pid}`, {
                  headers: { 'Content-Type': 'application/json' },
                });
                const pJson = await pRes.json();
                if (pRes.ok && (pJson.success === undefined || pJson.success)) {
                  details = pJson.data;
                }
              }
            } catch (e) {
              // ignore fetch error for this item
            }

            return {
              _id: item._id || cid || pid,
              name: isCustom ? (details?.design_name || 'Custom Design') : (details?.name || item.name),
              description: isCustom ? (details?.text || 'Thiết kế tùy chỉnh') : details?.description,
              size: item.size,
              price: item.unit_price ?? details?.price ?? 0,
              quantity: item.quantity || 0,
              image_url: (isCustom ? details?.image_url : details?.image_url) || item.image_url,
              product_id: pid,
              custom_design_id: cid,
              type: isCustom ? 'custom' : 'product',
            };
          })
        );
        setProducts(items);
      } else {
        console.error('Fetch cart by cartId error:', data.message);
      }
    } catch (e) {
      console.error('Fetch cart by cartId error:', e);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleOpenDelete = (index) => {
    setDeleteIndex(index);
    setOpenDialog(true);
  };

  // Xác nhận xóa (tạm thời chỉ xóa trên UI)
  const handleConfirmDelete = () => {
    if (deleteIndex !== null) {
      const updatedProducts = [...products];
      updatedProducts.splice(deleteIndex, 1);
      setProducts(updatedProducts);
      setOpenDialog(false);
      setDeleteIndex(null);
    }
  };

  // Hủy xóa
  const handleCancelDelete = () => {
    setOpenDialog(false);
    setDeleteIndex(null);
  };

  const totalPrice = selectedIndexes
    .map((i) => products[i]?.price || 0)
    .reduce((a, b) => a + b, 0);

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h5" fontWeight="bold" mb={2}>
          My Products
        </Typography>

        {/* Search Row */}
        <Box mb={2} maxWidth={300}>
          <TextField label="Search" variant="outlined" size="small" sx={{ width: 960 }} />
        </Box>

        {/* Filter Select Row */}
        <Box display="flex" gap={2} flexWrap="wrap" mb={2}>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Print Provider</InputLabel>
            <Select label="Print Provider">
              <MenuItem value="">All</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Brand</InputLabel>
            <Select label="Brand">
              <MenuItem value="">All</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Status</InputLabel>
            <Select label="Status">
              <MenuItem value="">All</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Delivery Options</InputLabel>
            <Select label="Delivery Options">
              <MenuItem value="">All</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Recently Updated</InputLabel>
            <Select label="Delivery Options">
              <MenuItem value="">All</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Product Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  {/* Checkbox cho từng sản phẩm sẽ nằm ở TableBody */}
                </TableCell>
                <TableCell>Product</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Price</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product, index) => (
                <TableRow key={index}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedIndexes.includes(index)}
                      onChange={() => {
                        setSelectedIndexes((prev) =>
                          prev.includes(index)
                            ? prev.filter((i) => i !== index)
                            : [...prev, index]
                        );
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: '#ccc',
                          borderRadius: 1,
                          overflow: 'hidden',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              borderRadius: '8px',
                            }}
                          />
                        ) : null}
                      </Box>
                      <Box>
                        <Typography fontWeight="bold">{product.name}</Typography>
                        <Typography variant="body2">{product.description}</Typography>
                        <Typography variant="body2">{product.size}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>{product.price}$</TableCell>
                  <TableCell align="right">
                    <IconButton>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleOpenDelete(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Thanh toán */}
        <Box mt={3} display="flex" alignItems="center" gap={2}>
          <Typography fontWeight="bold">
            Tổng tiền: {totalPrice}$
          </Typography>
          <Button
            variant="contained"
            color="primary"
            disabled={selectedIndexes.length === 0}
            onClick={() => {
              localStorage.setItem(
                "checkoutProducts",
                JSON.stringify(selectedIndexes.map((i) => products[i]))
              );
              window.location.href = "/checkout";
            }}
          >
            Thanh toán
          </Button>
        </Box>

        {/* Dialog xác nhận xóa */}
        <Dialog open={openDialog} onClose={handleCancelDelete}>
          <DialogTitle>Xác nhận xóa sản phẩm</DialogTitle>
          <DialogContent>
            <Typography>Bạn có chắc chắn muốn xóa sản phẩm này khỏi danh sách?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelDelete}>Hủy</Button>
            <Button color="error" variant="contained" onClick={handleConfirmDelete}>
              Xóa
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
    );
}