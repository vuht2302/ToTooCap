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
  Snackbar,
  Card,
  CardMedia
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
  Image as ImageIcon,
  Inventory
} from '@mui/icons-material';

// Import ProductService
import ProductService from '../../services/productService';

const getStockStatusColor = (stockQuantity) => {
  if (stockQuantity === 0) return 'error';
  if (stockQuantity < 10) return 'warning';
  if (stockQuantity < 50) return 'info';
  return 'success';
};

const getStockStatusText = (stockQuantity) => {
  if (stockQuantity === 0) return 'Hết hàng';
  if (stockQuantity < 10) return 'Sắp hết';
  if (stockQuantity < 50) return 'Ít hàng';
  return 'Còn hàng';
};

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [productDetails, setProductDetails] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    image_url: '',
    category_id: '60d5ec49f8c1b92c8c8e1d23' // Default category ID
  });

  // API pagination
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // Load products when component mounts or page changes
  useEffect(() => {
    loadProducts();
  }, [currentPage, rowsPerPage]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ProductService.getAllProducts(currentPage, rowsPerPage);
      
      if (response.success) {
        setProducts(response.data || []);
        setTotalProducts(response.totalProducts || 0);
        setTotalPages(response.totalPages || 0);
      } else {
        throw new Error(response.message || 'Failed to fetch products');
      }
    } catch (err) {
      setError('Không thể tải danh sách sản phẩm. Vui lòng thử lại.');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter products based on search and filters
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesStock = true;
    if (stockFilter !== 'all') {
      switch (stockFilter) {
        case 'in_stock':
          matchesStock = product.stock_quantity > 0;
          break;
        case 'low_stock':
          matchesStock = product.stock_quantity > 0 && product.stock_quantity < 10;
          break;
        case 'out_of_stock':
          matchesStock = product.stock_quantity === 0;
          break;
        default:
          matchesStock = true;
      }
    }

    let matchesPrice = true;
    if (priceFilter !== 'all') {
      switch (priceFilter) {
        case 'under_100':
          matchesPrice = product.price < 100;
          break;
        case '100_500':
          matchesPrice = product.price >= 100 && product.price <= 500;
          break;
        case '500_1000':
          matchesPrice = product.price >= 500 && product.price <= 1000;
          break;
        case 'over_1000':
          matchesPrice = product.price > 1000;
          break;
        default:
          matchesPrice = true;
      }
    }
    
    return matchesSearch && matchesStock && matchesPrice;
  });

  const handleMenuClick = (event, product) => {
    setAnchorEl(event.currentTarget);
    setSelectedProduct(product);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProduct(null);
  };

  const handleViewDetails = async () => {
    try {
      const details = await ProductService.getProductById(selectedProduct._id);
      setProductDetails(details.data || selectedProduct);
      setDialogType('view');
      setOpenDialog(true);
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Không thể tải chi tiết sản phẩm.',
        severity: 'error'
      });
    }
    handleMenuClose();
  };

  const handleAdd = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      stock_quantity: '',
      image_url: '',
      category_id: '60d5ec49f8c1b92c8c8e1d23'
    });
    setDialogType('add');
    setOpenDialog(true);
  };

  const handleEdit = () => {
    setFormData({
      name: selectedProduct?.name || '',
      description: selectedProduct?.description || '',
      price: selectedProduct?.price || '',
      stock_quantity: selectedProduct?.stock_quantity || '',
      image_url: selectedProduct?.image_url || '',
      category_id: selectedProduct?.category_id || '60d5ec49f8c1b92c8c8e1d23'
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
      // Validate form data
      if (!formData.name || !formData.price || !formData.stock_quantity) {
        setSnackbar({
          open: true,
          message: 'Vui lòng điền đầy đủ thông tin bắt buộc.',
          severity: 'error'
        });
        return;
      }

      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity),
        image_url: formData.image_url,
        category_id: formData.category_id
      };

      if (dialogType === 'add') {
        const response = await ProductService.addProduct(productData);
        if (response.success) {
          setSnackbar({
            open: true,
            message: 'Thêm sản phẩm thành công!',
            severity: 'success'
          });
          setOpenDialog(false);
          loadProducts(); // Reload data
        } else {
          throw new Error(response.message || 'Failed to add product');
        }
      } else if (dialogType === 'edit') {
        const response = await ProductService.updateProduct(selectedProduct._id, productData);
        if (response.success) {
          setSnackbar({
            open: true,
            message: 'Cập nhật sản phẩm thành công!',
            severity: 'success'
          });
          setOpenDialog(false);
          loadProducts(); // Reload data
        } else {
          throw new Error(response.message || 'Failed to update product');
        }
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: `Không thể ${dialogType === 'add' ? 'thêm' : 'cập nhật'} sản phẩm. ${err.message}`,
        severity: 'error'
      });
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await ProductService.deleteProduct(selectedProduct._id);
      if (response.success) {
        setSnackbar({
          open: true,
          message: 'Xóa sản phẩm thành công!',
          severity: 'success'
        });
        setOpenDialog(false);
        loadProducts(); // Reload data
      } else {
        throw new Error(response.message || 'Failed to delete product');
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: `Không thể xóa sản phẩm. ${err.message}`,
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount || 0);
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
            <Button color="inherit" size="small" onClick={loadProducts}>
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
          Quản lý sản phẩm
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={loadProducts}
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
            Thêm sản phẩm
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Tìm kiếm sản phẩm..."
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
        
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Tồn kho</InputLabel>
          <Select
            value={stockFilter}
            label="Tồn kho"
            onChange={(e) => setStockFilter(e.target.value)}
          >
            <MenuItem value="all">Tất cả</MenuItem>
            <MenuItem value="in_stock">Còn hàng</MenuItem>
            <MenuItem value="low_stock">Sắp hết</MenuItem>
            <MenuItem value="out_of_stock">Hết hàng</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Giá</InputLabel>
          <Select
            value={priceFilter}
            label="Giá"
            onChange={(e) => setPriceFilter(e.target.value)}
          >
            <MenuItem value="all">Tất cả</MenuItem>
            <MenuItem value="under_100">Dưới 100k</MenuItem>
            <MenuItem value="100_500">100k - 500k</MenuItem>
            <MenuItem value="500_1000">500k - 1M</MenuItem>
            <MenuItem value="over_1000">Trên 1M</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      {/* Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa' }}>
                  Sản phẩm
                </TableCell>
                <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa' }}>
                  Mô tả
                </TableCell>
                <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa' }}>
                  Giá
                </TableCell>
                <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa' }}>
                  Tồn kho
                </TableCell>
                <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa' }}>
                  Trạng thái
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
              {filteredProducts.map((product) => (
                <TableRow key={product._id} hover sx={{ '&:hover': { backgroundColor: '#f8f9fa' } }}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {product.image_url ? (
                        <Avatar 
                          src={product.image_url}
                          sx={{ 
                            width: 50, 
                            height: 50,
                            borderRadius: 2
                          }}
                        />
                      ) : (
                        <Avatar 
                          sx={{ 
                            width: 50, 
                            height: 50, 
                            bgcolor: 'grey.300',
                            borderRadius: 2
                          }}
                        >
                          <ImageIcon />
                        </Avatar>
                      )}
                      <Box>
                        <Typography variant="body2" fontWeight="600" sx={{ color: '#333' }}>
                          {product.name || 'N/A'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {product._id}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        maxWidth: 200,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {product.description || 'Không có mô tả'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="600" color="success.main">
                      {formatCurrency(product.price)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="600">
                      {product.stock_quantity?.toLocaleString() || 0}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStockStatusText(product.stock_quantity)}
                      color={getStockStatusColor(product.stock_quantity)}
                      size="small"
                      variant="filled"
                      sx={{ 
                        fontWeight: 500,
                        minWidth: 80
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(product.createdAt)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(product.updatedAt)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuClick(e, product)}
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
            count={totalProducts}
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
          {dialogType === 'add' && 'Thêm sản phẩm mới'}
          {dialogType === 'edit' && 'Chỉnh sửa sản phẩm'}
          {dialogType === 'view' && `Chi tiết sản phẩm: ${selectedProduct?.name}`}
          {dialogType === 'delete' && 'Xác nhận xóa sản phẩm'}
        </DialogTitle>
        <DialogContent>
          {dialogType === 'delete' ? (
            <Typography sx={{ py: 2 }}>
              Bạn có chắc chắn muốn xóa sản phẩm "{selectedProduct?.name}"?
            </Typography>
          ) : dialogType === 'view' ? (
            <Box sx={{ py: 2 }}>
              {productDetails ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {/* Product Image */}
                  {productDetails.image_url && (
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Card sx={{ maxWidth: 300 }}>
                        <CardMedia
                          component="img"
                          height="200"
                          image={productDetails.image_url}
                          alt={productDetails.name}
                          sx={{ objectFit: 'cover' }}
                        />
                      </Card>
                    </Box>
                  )}

                  {/* Product Info */}
                  <Box>
                    <Typography variant="h6" gutterBottom>Thông tin sản phẩm</Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                      <Typography><strong>Tên sản phẩm:</strong> {productDetails.name}</Typography>
                      <Typography><strong>Giá:</strong> {formatCurrency(productDetails.price)}</Typography>
                      <Typography><strong>Tồn kho:</strong> {productDetails.stock_quantity}</Typography>
                      <Typography><strong>Trạng thái:</strong> 
                        <Chip 
                          label={getStockStatusText(productDetails.stock_quantity)} 
                          color={getStockStatusColor(productDetails.stock_quantity)} 
                          size="small" 
                          sx={{ ml: 1 }}
                        />
                      </Typography>
                      <Typography><strong>Ngày tạo:</strong> {formatDate(productDetails.createdAt)}</Typography>
                      <Typography><strong>Cập nhật:</strong> {formatDate(productDetails.updatedAt)}</Typography>
                    </Box>
                  </Box>

                  {/* Description */}
                  <Box>
                    <Typography variant="h6" gutterBottom>Mô tả</Typography>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {productDetails.description || 'Không có mô tả'}
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
            // Add/Edit Form
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
              <TextField
                label="Tên sản phẩm *"
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
                rows={3}
                value={formData.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                variant="outlined"
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Giá *"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleFormChange('price', e.target.value)}
                  variant="outlined"
                  required
                  sx={{ flex: 1 }}
                  InputProps={{
                    inputProps: { min: 0, step: 0.01 }
                  }}
                />
                <TextField
                  label="Số lượng tồn kho *"
                  type="number"
                  value={formData.stock_quantity}
                  onChange={(e) => handleFormChange('stock_quantity', e.target.value)}
                  variant="outlined"
                  required
                  sx={{ flex: 1 }}
                  InputProps={{
                    inputProps: { min: 0, step: 1 }
                  }}
                />
              </Box>
              <TextField
                label="URL hình ảnh"
                fullWidth
                value={formData.image_url}
                onChange={(e) => handleFormChange('image_url', e.target.value)}
                variant="outlined"
                placeholder="https://example.com/image.jpg"
              />
              <TextField
                label="Category ID"
                fullWidth
                value={formData.category_id}
                onChange={(e) => handleFormChange('category_id', e.target.value)}
                variant="outlined"
                helperText="ID của danh mục sản phẩm"
              />
              
              {/* Image Preview */}
              {formData.image_url && (
                <Box>
                  <Typography variant="body2" gutterBottom>Xem trước hình ảnh:</Typography>
                  <Card sx={{ maxWidth: 200 }}>
                    <CardMedia
                      component="img"
                      height="120"
                      image={formData.image_url}
                      alt="Preview"
                      sx={{ objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </Card>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenDialog(false)} sx={{ textTransform: 'none' }}>
            {dialogType === 'view' ? 'Đóng' : 'Hủy'}
          </Button>
          {dialogType === 'add' && (
            <Button 
              variant="contained" 
              onClick={handleSubmit}
              sx={{ textTransform: 'none' }}
            >
              Thêm sản phẩm
            </Button>
          )}
          {dialogType === 'edit' && (
            <Button 
              variant="contained" 
              onClick={handleSubmit}
              sx={{ textTransform: 'none' }}
            >
              Cập nhật
            </Button>
          )}
          {dialogType === 'delete' && (
            <Button 
              variant="contained" 
              color="error"
              onClick={handleDeleteConfirm}
              sx={{ textTransform: 'none' }}
            >
              Xóa
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

export default ProductTable;