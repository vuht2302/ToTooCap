import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  InputAdornment,
  Avatar,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
  TablePagination
} from '@mui/material';
import { Add, Download, Refresh, Search, Image as ImageIcon } from '@mui/icons-material';
import ImageService from '../../services/imageService';

const ImagesTable = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [openAdd, setOpenAdd] = useState(false);
  const [form, setForm] = useState({ name: '', image_url: '', color: '', product_id: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const loadImages = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await ImageService.getAllImages();
      if (res?.success) {
        setImages(res.data || []);
      } else {
        throw new Error(res?.message || 'Failed to fetch');
      }
    } catch (e) {
      console.error(e);
      setError('Không thể tải danh sách ảnh.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadImages(); }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return images.filter(i =>
      i.name?.toLowerCase().includes(q) ||
      i.product_id?.toLowerCase().includes(q) ||
      i.color?.toLowerCase().includes(q)
    );
  }, [images, search]);

  const handleAdd = async () => {
    try {
      await ImageService.addProductImage(form);
      setSnackbar({ open: true, message: 'Thêm ảnh thành công', severity: 'success' });
      setOpenAdd(false);
      setForm({ name: '', image_url: '', color: '', product_id: '' });
      loadImages();
    } catch (e) {
      setSnackbar({ open: true, message: 'Thêm ảnh thất bại', severity: 'error' });
    }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleString('vi-VN') : 'N/A';

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ width: '100%' }}>
        <Alert severity="error" action={<Button onClick={loadImages} startIcon={<Refresh />}>Thử lại</Button>}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight={600}>Quản lý ảnh sản phẩm</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<Refresh />} onClick={loadImages}>Làm mới</Button>
          <Button variant="outlined" startIcon={<Download />}>Xuất Excel</Button>
          <Button variant="contained" startIcon={<Add />} onClick={() => setOpenAdd(true)}>Thêm ảnh</Button>
        </Box>
      </Box>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          placeholder="Tìm kiếm theo tên, màu, product_id"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 320 }}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
        />
      </Box>

      {/* Table */}
      <Paper>
        <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa' }}>Ảnh</TableCell>
                <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa' }}>Tên</TableCell>
                <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa' }}>Màu</TableCell>
                <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa' }}>Product ID</TableCell>
                <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa' }}>Tạo</TableCell>
                <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa' }}>Cập nhật</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((img) => (
                <TableRow key={img._id} hover>
                  <TableCell>
                    <Avatar variant="rounded" src={img.image_url} alt={img.name} sx={{ width: 48, height: 48 }}>
                      <ImageIcon />
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={600}>{img.name}</Typography>
                    <Typography variant="caption" color="text.secondary">ID: {img._id}</Typography>
                  </TableCell>
                  <TableCell>{img.color || 'N/A'}</TableCell>
                  <TableCell>{img.product_id || 'N/A'}</TableCell>
                  <TableCell>{formatDate(img.createdAt)}</TableCell>
                  <TableCell>{formatDate(img.updatedAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ borderTop: '1px solid #eee' }}>
          <TablePagination
            component="div"
            rowsPerPageOptions={[5, 10, 25, 50]}
            count={filtered.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, p) => setPage(p)}
            onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
            labelRowsPerPage="Số hàng mỗi trang:"
          />
        </Box>
      </Paper>

      {/* Add dialog */}
      <Dialog open={openAdd} onClose={() => setOpenAdd(false)} fullWidth maxWidth="sm">
        <DialogTitle>Thêm ảnh sản phẩm</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField label="Tên" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <TextField label="Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} required />
            <TextField label="Màu" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
            <TextField label="Product ID" value={form.product_id} onChange={(e) => setForm({ ...form, product_id: e.target.value })} required />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAdd(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleAdd}>Thêm</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ImagesTable;
