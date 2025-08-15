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

// Import OrderService and apiUrl
import OrderService from '../../services/orderService';
import { apiUrl } from '../../config/api';

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
    case 'done':
    case 'hoàn thành':
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
  const [users, setUsers] = useState([]);
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

  // Load orders and users when component mounts
  useEffect(() => {
    loadOrdersAndUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(apiUrl('/auth/user/get'), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      
      const data = await response.json();
      if (response.ok && data.success) {
        return data.data || [];
      }
      return [];
    } catch (err) {
      console.error('Error loading users:', err);
      return [];
    }
  };

  const loadOrderItems = async (orderId) => {
    try {
      // The API returns all order items with pagination, so we need to get all items
      // and filter by orderId on the client side
      const response = await fetch(apiUrl(`/order/orderItem/get?currentPage=1&limit=100&sortBy=createdAt&sortOrder=desc`), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        // Filter items by the specific orderId
        const filteredItems = data.data.filter(item => item.order_id === orderId);
        return filteredItems || [];
      }
      return [];
    } catch (err) {
      console.error('Error loading order items:', err);
      return [];
    }
  };

  const loadProductDetails = async (productId) => {
    try {
      const response = await fetch(apiUrl(`/product/get/${productId}`), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        return data.data;
      }
      return null;
    } catch (err) {
      console.error('Error loading product details:', err);
      return null;
    }
  };

  const formatExpectedDeliveryDate = (orderDate) => {
    const date = new Date(orderDate);
    date.setDate(date.getDate() + 5);
    return date.toLocaleDateString('vi-VN');
  };

  const loadOrdersAndUsers = async () => {
  try {
    setLoading(true);
    setError(null);
    
    // Load both orders and users in parallel
    const [orderData, usersData] = await Promise.all([
      OrderService.getAllOrders(),
      loadUsers()
    ]);
    
    setUsers(usersData);
    
    // Helper function to find user by ID
    const findUserById = (userId) => {
      return usersData.find(user => user._id === userId) || null;
    };
    
    // Map orders with user information and load items
    const mappedOrders = await Promise.all(
      Array.isArray(orderData.data)
        ? orderData.data.map(async (order) => {
            const user = findUserById(order.user_id);
            const orderItems = await loadOrderItems(order._id);
            
            // Load product details for each order item
            const itemsWithProductDetails = await Promise.all(
              orderItems.map(async (item, index) => {
                
                if (item.product_id) {
                  const productDetails = await loadProductDetails(item.product_id);
                  
                  const processedItem = {
                    ...item,
                    product_name: productDetails ? productDetails.name : 'Sản phẩm không xác định',
                    product_description: productDetails ? productDetails.description : '',
                    product_price: productDetails ? productDetails.price : item.unit_price || 0,
                    product_image: productDetails ? productDetails.image_url : '',
                    price: item.unit_price || 0, // Use unit_price from the order item
                    quantity: item.quantity || 1,
                  };
                  return processedItem;
                } else {
                  const fallbackItem = {
                    ...item,
                    product_name: item.product_name || 'Sản phẩm không xác định',
                    price: item.unit_price || 0,
                    quantity: item.quantity || 1,
                  };
                  return fallbackItem;
                }
              })
            );
            
            const mappedOrder = {
              _id: order._id,
              orderNumber: order._id,
              customerName: user ? user.username : 'Khách hàng',
              customerEmail: user ? user.email : 'N/A',
              customerPhone: user ? user.phone : 'N/A',
              customerAddress: user ? user.address : 'N/A',
              productName: itemsWithProductDetails.length > 0 ? itemsWithProductDetails[0].product_name : 'N/A',
              items: itemsWithProductDetails,
              quantity: itemsWithProductDetails.reduce((sum, item) => sum + (item.quantity || 0), 0),
              totalAmount: order.total_amount,
              status: order.status,
              paymentMethod: order.payment_method,
              createdAt: order.createdAt || order.order_date,
              expectedDelivery: formatExpectedDeliveryDate(order.createdAt || order.order_date),
              deliveryDate: order.deliveryDate || '',
              shippingAddress: order.shipping_address,
              user_id: order.user_id,
            };
            return mappedOrder;
          })
        : []
    );
    
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
    // Don't clear selectedOrder here as it might be needed for dialogs
  };

  const handleViewDetails = async () => {
    try {
      if (!selectedOrder) {
        console.error('No order selected for viewing details');
        setSnackbar({
          open: true,
          message: 'Không có đơn hàng được chọn để xem chi tiết.',
          severity: 'error'
        });
        return;
      }

      const orderId = selectedOrder._id || selectedOrder.id;
      if (!orderId) {
        console.error('Order ID not found:', selectedOrder);
        setSnackbar({
          open: true,
          message: 'Không tìm thấy ID đơn hàng.',
          severity: 'error'
        });
        return;
      }

      setAnchorEl(null); // Close menu but keep selectedOrder
      setDialogType('view');
      setOpenDialog(true);

      const [details, items] = await Promise.all([
        OrderService.getOrderById(orderId),
        loadOrderItems(orderId)
      ]);
      
      // Load product details for each item
      const itemsWithProductDetails = await Promise.all(
        items.map(async (item) => {
          if (item.product_id) {
            const productDetails = await loadProductDetails(item.product_id);
            return {
              ...item,
              product_name: productDetails ? productDetails.name : 'Sản phẩm không xác định',
              product_description: productDetails ? productDetails.description : '',
              product_price: productDetails ? productDetails.price : item.unit_price || 0,
              product_image: productDetails ? productDetails.image_url : '',
              price: item.unit_price || 0,
              quantity: item.quantity || 1,
            };
          }
          return {
            ...item,
            product_name: item.product_name || 'Sản phẩm không xác định',
            price: item.unit_price || 0,
            quantity: item.quantity || 1,
          };
        })
      );
      
      // Merge the details with the loaded items
      const detailsWithItems = {
        ...details,
        items: itemsWithProductDetails
      };
      
      setOrderDetails(detailsWithItems);
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Không thể tải chi tiết đơn hàng.',
        severity: 'error'
      });
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!selectedOrder) return;
    
    try {
      setAnchorEl(null); // Close menu but keep selectedOrder
      const token = localStorage.getItem('accessToken');
      const orderId = selectedOrder._id || selectedOrder.id;
      
      const response = await fetch(apiUrl(`/order/update/${orderId}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      
      if (response.ok && (data.success === undefined || data.success)) {
        setSnackbar({
          open: true,
          message: 'Cập nhật trạng thái đơn hàng thành công!',
          severity: 'success'
        });
        loadOrdersAndUsers(); // Reload data
      } else {
        throw new Error(data.message || 'Cập nhật thất bại');
      }
    } catch (err) {
      console.error('Update order status error:', err);
      setSnackbar({
        open: true,
        message: err.message || 'Không thể cập nhật trạng thái đơn hàng.',
        severity: 'error'
      });
    }
    setSelectedOrder(null); // Clear after operation
  };

  const handleDelete = () => {
    if (!selectedOrder) {
      console.error('No order selected for deletion');
      setSnackbar({
        open: true,
        message: 'Không có đơn hàng được chọn để xóa.',
        severity: 'error'
      });
      return;
    }
    setAnchorEl(null); // Close menu but keep selectedOrder
    setDialogType('delete');
    setOpenDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      if (!selectedOrder) {
        console.error('No order selected for deletion');
        setSnackbar({
          open: true,
          message: 'Không có đơn hàng được chọn để xóa.',
          severity: 'error'
        });
        return;
      }

      const orderId = selectedOrder._id || selectedOrder.id;
      if (!orderId) {
        console.error('Order ID not found:', selectedOrder);
        setSnackbar({
          open: true,
          message: 'Không tìm thấy ID đơn hàng.',
          severity: 'error'
        });
        return;
      }

      await OrderService.deleteOrder(orderId);
      setSnackbar({
        open: true,
        message: 'Xóa đơn hàng thành công!',
        severity: 'success'
      });
      setOpenDialog(false);
      setSelectedOrder(null); // Clear selected order
      loadOrdersAndUsers(); // Reload data
    } catch (err) {
      console.error('Error deleting order:', err);
      setSnackbar({
        open: true,
        message: 'Không thể xóa đơn hàng.',
        severity: 'error'
      });
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedOrder(null);
    setOrderDetails(null);
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
            onClick={loadOrdersAndUsers}
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
                {/* <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa' }}>
                  Khách hàng
                </TableCell> */}
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
                  {/* <TableCell>
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
                  </TableCell> */}
                  <TableCell>
                    <Box>
                      {order.items && order.items.length > 0 ? (
                        <Box>
                          <Typography variant="body2" fontWeight="500">
                            {order.items[0].product_name || 'N/A'}
                          </Typography>
                          {order.items.length > 1 && (
                            <Typography variant="caption" color="primary.main">
                              +{order.items.length - 1} sản phẩm khác
                            </Typography>
                          )}
                          <Typography variant="caption" color="text.secondary" display="block">
                            Tổng SL: {order.items.reduce((sum, item) => sum + (item.quantity || 0), 0)}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Không có sản phẩm
                        </Typography>
                      )}
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
                      {order.expectedDelivery || 'Chưa xác định'}
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
        <MenuItem onClick={() => handleStatusChange('Done')}>
          <Edit sx={{ mr: 1, fontSize: 18 }} />
          Đã Thanh Toán
        </MenuItem>
      
        <MenuItem onClick={() => handleStatusChange('Done')}>
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
        onClose={handleDialogClose} 
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
                      <Typography><strong>Ngày giao dự kiến:</strong> {orderDetails.expectedDelivery || formatExpectedDeliveryDate(orderDetails.createdAt)}</Typography>
                      <Typography><strong>Phương thức thanh toán:</strong> {orderDetails.paymentMethod}</Typography>
                    </Box>
                  </Box>

                  {/* Items */}
                  {orderDetails.items && orderDetails.items.length > 0 && (
                    <Box>
                      <Typography variant="h6" gutterBottom>Sản phẩm ({orderDetails.items.length})</Typography>
                      <Box sx={{ border: '1px solid #eee', borderRadius: 1, overflow: 'hidden' }}>
                        {orderDetails.items.map((item, index) => (
                          <Box 
                            key={index} 
                            sx={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              p: 2, 
                              borderBottom: index < orderDetails.items.length - 1 ? '1px solid #eee' : 'none',
                              backgroundColor: index % 2 === 0 ? '#fafafa' : 'white',
                              gap: 2
                            }}
                          >
                            {/* Product Image */}
                            {item.product_image && (
                              <Box 
                                component="img"
                                src={item.product_image}
                                alt={item.product_name}
                                sx={{
                                  width: 60,
                                  height: 60,
                                  objectFit: 'cover',
                                  borderRadius: 1,
                                  border: '1px solid #ddd'
                                }}
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            )}
                            
                            {/* Product Info */}
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="body2" fontWeight="500">
                                {item.product_name || item.productName || 'Sản phẩm không xác định'}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Số lượng: {item.quantity || 1}
                              </Typography>
                              {item.product_description && (
                                <Typography variant="caption" color="text.secondary" display="block">
                                  {item.product_description}
                                </Typography>
                              )}
                            </Box>
                            
                            {/* Price Info */}
                            <Box sx={{ textAlign: 'right' }}>
                              <Typography variant="body2" fontWeight="600">
                                {formatCurrency((item.product_price || item.price || 0) * (item.quantity || 1))}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {formatCurrency(item.product_price || item.price || 0)} x {item.quantity || 1}
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                      </Box>
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
          <Button onClick={handleDialogClose} sx={{ textTransform: 'none' }}>
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