import React, { useState, useEffect } from 'react';
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  Box,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  TablePagination,
  Paper,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import {
  MoreVert,
  Search,
  Visibility,
  Edit,
  Delete,
  Add,
  Refresh,
  Download,
  Category as CategoryIcon,
} from '@mui/icons-material';

// Import CategoryService
import CategoryService from '../../services/categoryService';

const CategoryTable = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [categoryDetails, setCategoryDetails] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  
  // API pagination
  const [totalCategories, setTotalCategories] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // Load categories when component mounts or page changes
  useEffect(() => {
    loadCategories();
  }, [currentPage, rowsPerPage]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await CategoryService.getAllCategories(currentPage, rowsPerPage);
      
      if (response.success) {
        setCategories(response.data || []);
        setTotalCategories(response.totalCategories || 0);
        setTotalPages(response.totalPages || 0);
      } else {
        throw new Error(response.message || 'Failed to fetch categories');
      }
    } catch (err) {
      setError('Không thể tải danh sách danh mục. Vui lòng thử lại.');
      console.error('Error loading categories:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter categories based on search
  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleMenuClick = (event, category) => {
    setAnchorEl(event.currentTarget);
    setSelectedCategory(category);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCategory(null);
  };

  const handleViewDetails = async () => {
    try {
      const details = await CategoryService.getCategoryById(selectedCategory._id);
      setCategoryDetails(details.data || selectedCategory);
      setDialogType('view');
      setOpenDialog(true);
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Không thể tải chi tiết danh mục.',
        severity: 'error'
      });
    }
    handleMenuClose();
  };

  const handleAdd = () => {
    setFormData({
      name: '',
      description: ''
    });
    setDialogType('add');
    setOpenDialog(true);
  };

  const handleEdit = () => {
    setFormData({
      name: selectedCategory?.name || '',
      description: selectedCategory?.description || ''
    });
    setDialogType('edit');
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleDelete = () => {
    setDialogType('delete');
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleSubmit = async () => {
    try {
      if (dialogType === 'add') {
        await CategoryService.addCategory(formData);
        setSnackbar({
          open: true,
          message: 'Thêm danh mục thành công!',
          severity: 'success'
        });
      } else if (dialogType === 'edit') {
        await CategoryService.updateCategory(selectedCategory._id, formData);
        setSnackbar({
          open: true,
          message: 'Cập nhật danh mục thành công!',
          severity: 'success'
        });
      } else if (dialogType === 'delete') {
        await CategoryService.deleteCategory(selectedCategory._id);
        setSnackbar({
          open: true,
          message: 'Xóa danh mục thành công!',
          severity: 'success'
        });
      }
      
      setOpenDialog(false);
      loadCategories(); // Reload data
    } catch (err) {
      setSnackbar({
        open: true,
        message: `Không thể ${dialogType === 'add' ? 'thêm' : dialogType === 'edit' ? 'cập nhật' : 'xóa'} danh mục.`,
        severity: 'error'
      });
    }
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setCurrentPage(newPage + 1); // API uses 1-based pagination
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ width: '100%' }}>
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={loadCategories}>
              <Refresh sx={{ mr: 1 }} />
              Thử lại
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight="600">
          Quản lý danh mục
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={loadCategories}
            sx={{ textTransform: 'none' }}
          >
            Làm mới
          </Button>
          <Button
            variant="outlined"
            startIcon={<Download />}
            sx={{ textTransform: 'none' }}
          >
            Xuất Excel
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAdd}
            sx={{ textTransform: 'none' }}
          >
            Thêm danh mục
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Tìm kiếm danh mục..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          sx={{ minWidth: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      
      {/* Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa' }}>
                  Danh mục
                </TableCell>
                <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa' }}>
                  Mô tả
                </TableCell>
                <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa' }}>
                  Ngày tạo
                </TableCell>
                <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa' }}>
                  Cập nhật
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 600, backgroundColor: '#f8f9fa' }}>
                  Hành động
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow key={category._id} hover sx={{ '&:hover': { backgroundColor: '#f8f9fa' } }}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar 
                        sx={{ 
                          width: 40, 
                          height: 40, 
                          bgcolor: 'primary.light',
                          borderRadius: 2
                        }}
                      >
                        <CategoryIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="600" sx={{ color: '#333' }}>
                          {category.name || 'N/A'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {category._id}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        maxWidth: 300,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {category.description || 'Không có mô tả'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(category.createdAt)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(category.updatedAt)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuClick(e, category)}
                      sx={{ 
                        '&:hover': { 
                          backgroundColor: 'primary.light',
                          color: 'primary.main'
                        }
                      }}
                    >
                      <MoreVert />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Box sx={{ borderTop: '1px solid #e0e0e0' }}>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={totalCategories}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Số hàng mỗi trang:"
            labelDisplayedRows={({ from, to, count }) => 
              `${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`
            }
          />
        </Box>
      </Paper>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            borderRadius: 2
          }
        }}
      >
        <MenuItem onClick={handleViewDetails}>
          <Visibility sx={{ mr: 1, fontSize: 18 }} />
          Xem chi tiết
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <Edit sx={{ mr: 1, fontSize: 18 }} />
          Chỉnh sửa
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 1, fontSize: 18 }} />
          Xóa
        </MenuItem>
      </Menu>

      {/* Dialog for Add/Edit/View/Delete */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)} 
        maxWidth={dialogType === 'view' ? 'md' : 'sm'} 
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          {dialogType === 'add' && 'Thêm danh mục mới'}
          {dialogType === 'edit' && 'Chỉnh sửa danh mục'}
          {dialogType === 'view' && `Chi tiết danh mục: ${selectedCategory?.name}`}
          {dialogType === 'delete' && 'Xác nhận xóa danh mục'}
        </DialogTitle>
        <DialogContent>
          {dialogType === 'delete' ? (
            <Typography sx={{ py: 2 }}>
              Bạn có chắc chắn muốn xóa danh mục "{selectedCategory?.name}"?
            </Typography>
          ) : dialogType === 'view' ? (
            <Box sx={{ py: 2 }}>
              {categoryDetails ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {/* Category Info */}
                  <Box>
                    <Typography variant="h6" gutterBottom>Thông tin danh mục</Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                      <Typography><strong>Tên danh mục:</strong> {categoryDetails.name}</Typography>
                      <Typography><strong>ID:</strong> {categoryDetails._id}</Typography>
                      <Typography><strong>Ngày tạo:</strong> {formatDate(categoryDetails.createdAt)}</Typography>
                      <Typography><strong>Cập nhật:</strong> {formatDate(categoryDetails.updatedAt)}</Typography>
                    </Box>
                  </Box>

                  {/* Description */}
                  <Box>
                    <Typography variant="h6" gutterBottom>Mô tả</Typography>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {categoryDetails.description || 'Không có mô tả'}
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              )}
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
              <TextField
                label="Tên danh mục"
                fullWidth
                value={formData.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
                variant="outlined"
                required
              />
              <TextField
                label="Mô tả"
                fullWidth
                multiline
                rows={4}
                value={formData.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                variant="outlined"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenDialog(false)} sx={{ textTransform: 'none' }}>
            {dialogType === 'view' ? 'Đóng' : 'Hủy'}
          </Button>
          {dialogType === 'delete' && (
            <Button 
              variant="contained" 
              color="error"
              onClick={handleSubmit}
              sx={{ textTransform: 'none' }}
            >
              Xóa
            </Button>
          )}
          {(dialogType === 'add' || dialogType === 'edit') && (
            <Button 
              variant="contained" 
              onClick={handleSubmit}
              sx={{ textTransform: 'none' }}
            >
              {dialogType === 'add' ? 'Thêm' : 'Cập nhật'}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CategoryTable;