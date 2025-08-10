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
  Tooltip
} from '@mui/material';
import {
  MoreVert,
  Search,
  Visibility,
  Edit,
  Delete,
  LocalShipping,
  CheckCircle,
  Cancel,
  Refresh,
  Print,
  Download
} from '@mui/icons-material';

// Import OrderService
import OrderService from '../../services/orderService';

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'pending':
    case 'chờ xử lý':
      return 'warning';
    case 'processing':
    case 'đang xử lý':
      return 'info';
    case 'shipped':
    case 'đã gửi':
      return 'primary';
    case 'delivered':
    case 'đã giao':
      return 'success';
    case 'cancelled':
    case 'đã hủy':
      return 'error';
    default:
      return 'default';
  }
};

const getPriorityColor = (priority) => {
  switch (priority?.toLowerCase()) {
    case 'high':
    case 'cao':
      return 'error';
    case 'medium':
    case 'trung bình':
      return 'warning';
    case 'low':
    case 'thấp':
      return 'success';
    default:
      return 'default';
  }
};

const OrderTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [orderDetails, setOrderDetails] = useState(null);

  // Load orders when component mounts
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
  try {
    setLoading(true);
    setError(null);
    const orderData = await OrderService.getAllOrders();
    // Map lại dữ liệu cho đúng format UI
    const mappedOrders = Array.isArray(orderData.data)
      ? orderData.data.map(order => ({
          _id: order._id,
          orderNumber: order._id, // hoặc tạo số đơn hàng riêng nếu có
          customerName: order.customerName || 'Khách hàng',
          customerEmail: order.customerEmail || '',
          productName: order.productName || '', // hoặc lấy từ items nếu có
          items: order.items || [],
          quantity: order.quantity || 1,
          totalAmount: order.total_amount,
          status: order.status,
          paymentMethod: order.payment_method,
          createdAt: order.createdAt || order.order_date,
          expectedDelivery: order.expectedDelivery || '',
          deliveryDate: order.deliveryDate || '',
          shippingAddress: order.shipping_address,
        }))
      : [];
    setOrders(mappedOrders);
  } catch (err) {
    setError('Không thể tải danh sách đơn hàng. Vui lòng thử lại.');
    console.error('Error loading orders:', err);
  } finally {
    setLoading(false);
  }
};

  // Filter orders based on search and filters
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status?.toLowerCase() === statusFilter;
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const orderDate = new Date(order.createdAt || order.orderDate);
      const today = new Date();
      const diffTime = Math.abs(today - orderDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      switch (dateFilter) {
        case 'today':
          matchesDate = diffDays <= 1;
          break;
        case 'week':
          matchesDate = diffDays <= 7;
          break;
        case 'month':
          matchesDate = diffDays <= 30;
          break;
        default:
          matchesDate = true;
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleMenuClick = (event, order) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrder(order);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedOrder(null);
  };

  const handleViewDetails = async () => {
    try {
      const details = await OrderService.getOrderById(selectedOrder.id);
      setOrderDetails(details);
      setDialogType('view');
      setOpenDialog(true);
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Không thể tải chi tiết đơn hàng.',
        severity: 'error'
      });
    }
    handleMenuClose();
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await OrderService.updateOrderStatus(selectedOrder.id, newStatus);
      setSnackbar({
        open: true,
        message: 'Cập nhật trạng thái đơn hàng thành công!',
        severity: 'success'
      });
      loadOrders(); // Reload data
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Không thể cập nhật trạng thái đơn hàng.',
        severity: 'error'
      });
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    setDialogType('delete');
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    try {
      await OrderService.deleteOrder(selectedOrder.id);
      setSnackbar({
        open: true,
        message: 'Xóa đơn hàng thành công!',
        severity: 'success'
      });
      setOpenDialog(false);
      loadOrders(); // Reload data
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Không thể xóa đơn hàng.',
        severity: 'error'
      });
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
            <Button color="inherit" size="small" onClick={loadOrders}>
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
          Quản lý đơn hàng
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={loadOrders}
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
        </Box>
      </Box>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Tìm kiếm đơn hàng..."
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
          <InputLabel>Trạng thái</InputLabel>
          <Select
            value={statusFilter}
            label="Trạng thái"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">Tất cả</MenuItem>
            <MenuItem value="pending">Chờ xử lý</MenuItem>
            <MenuItem value="processing">Đang xử lý</MenuItem>
            <MenuItem value="shipped">Đã gửi</MenuItem>
            <MenuItem value="delivered">Đã giao</MenuItem>
            <MenuItem value="cancelled">Đã hủy</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Thời gian</InputLabel>
          <Select
            value={dateFilter}
            label="Thời gian"
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <MenuItem value="all">Tất cả</MenuItem>
            <MenuItem value="today">Hôm nay</MenuItem>
            <MenuItem value="week">Tuần này</MenuItem>
            <MenuItem value="month">Tháng này</MenuItem>
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
                  Đơn hàng
                </TableCell>
                <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa' }}>
                  Khách hàng
                </TableCell>
                <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa' }}>
                  Sản phẩm
                </TableCell>
                <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa' }}>
                  Trạng thái
                </TableCell>
                <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa' }}>
                  Tổng tiền
                </TableCell>
                <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa' }}>
                  Ngày đặt
                </TableCell>
                <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa' }}>
                  Ngày giao dự kiến
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 600, backgroundColor: '#f8f9fa' }}>
                  Hành động
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((order) => (
                <TableRow key={order._id} hover sx={{ '&:hover': { backgroundColor: '#f8f9fa' } }}>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="600" sx={{ color: '#333' }}>
                        #{order.orderNumber || order.id}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {order.paymentMethod || 'N/A'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar 
                        sx={{ 
                          width: 32, 
                          height: 32, 
                          bgcolor: 'primary.light',
                          fontSize: '0.875rem'
                        }}
                      >
                        {order.customerName?.charAt(0) || 'U'}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="500">
                          {order.customerName || 'N/A'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {order.customerEmail || 'N/A'}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="500">
                        {order.productName || order.items?.[0]?.productName || 'N/A'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Số lượng: {order.quantity || order.totalItems || 1}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={order.status || 'N/A'}
                      color={getStatusColor(order.status)}
                      size="small"
                      variant="filled"
                      sx={{ 
                        fontWeight: 500,
                        minWidth: 80
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="600" color="success.main">
                      {formatCurrency(order.totalAmount || order.total)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(order.createdAt || order.orderDate)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(order.expectedDelivery || order.deliveryDate)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuClick(e, order)}
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
            count={filteredOrders.length}
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
        <MenuItem onClick={() => handleStatusChange('Processing')}>
          <Edit sx={{ mr: 1, fontSize: 18 }} />
          Đang xử lý
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('Shipped')}>
          <LocalShipping sx={{ mr: 1, fontSize: 18 }} />
          Đã gửi
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('Delivered')}>
          <CheckCircle sx={{ mr: 1, fontSize: 18 }} />
          Đã giao
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('Cancelled')} sx={{ color: 'warning.main' }}>
          <Cancel sx={{ mr: 1, fontSize: 18 }} />
          Hủy đơn
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 1, fontSize: 18 }} />
          Xóa
        </MenuItem>
      </Menu>

      {/* Dialog for View Details/Delete */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)} 
        maxWidth={dialogType === 'view' ? 'md' : 'sm'} 
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          {dialogType === 'view' && `Chi tiết đơn hàng #${selectedOrder?.orderNumber || selectedOrder?.id}`}
          {dialogType === 'delete' && 'Xác nhận xóa đơn hàng'}
        </DialogTitle>
        <DialogContent>
          {dialogType === 'delete' ? (
            <Typography sx={{ py: 2 }}>
              Bạn có chắc chắn muốn xóa đơn hàng "#{selectedOrder?.orderNumber || selectedOrder?.id}"?
            </Typography>
          ) : (
            <Box sx={{ py: 2 }}>
              {orderDetails ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {/* Customer Info */}
                  <Box>
                    <Typography variant="h6" gutterBottom>Thông tin khách hàng</Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                      <Typography><strong>Tên:</strong> {orderDetails.customerName}</Typography>
                      <Typography><strong>Email:</strong> {orderDetails.customerEmail}</Typography>
                      <Typography><strong>Điện thoại:</strong> {orderDetails.customerPhone || 'N/A'}</Typography>
                      <Typography><strong>Địa chỉ:</strong> {orderDetails.shippingAddress || 'N/A'}</Typography>
                    </Box>
                  </Box>

                  {/* Order Info */}
                  <Box>
                    <Typography variant="h6" gutterBottom>Thông tin đơn hàng</Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                      <Typography><strong>Trạng thái:</strong> 
                        <Chip 
                          label={orderDetails.status} 
                          color={getStatusColor(orderDetails.status)} 
                          size="small" 
                          sx={{ ml: 1 }}
                        />
                      </Typography>
                      <Typography><strong>Tổng tiền:</strong> {formatCurrency(orderDetails.totalAmount)}</Typography>
                      <Typography><strong>Ngày đặt:</strong> {formatDate(orderDetails.createdAt)}</Typography>
                      <Typography><strong>Phương thức thanh toán:</strong> {orderDetails.paymentMethod}</Typography>
                    </Box>
                  </Box>

                  {/* Items */}
                  {orderDetails.items && (
                    <Box>
                      <Typography variant="h6" gutterBottom>Sản phẩm</Typography>
                      {orderDetails.items.map((item, index) => (
                        <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid #eee' }}>
                          <Box>
                            <Typography variant="body2" fontWeight="500">{item.productName}</Typography>
                            <Typography variant="caption" color="text.secondary">Số lượng: {item.quantity}</Typography>
                          </Box>
                          <Typography variant="body2" fontWeight="600">
                            {formatCurrency(item.price * item.quantity)}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenDialog(false)} sx={{ textTransform: 'none' }}>
            {dialogType === 'view' ? 'Đóng' : 'Hủy'}
          </Button>
          {dialogType === 'view' && (
            <Button 
              variant="outlined" 
              startIcon={<Print />}
              sx={{ textTransform: 'none' }}
            >
              In đơn hàng
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

export default OrderTable;