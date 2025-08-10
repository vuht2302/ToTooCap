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
  Add,
  Edit,
  Delete,
  Block,
  CheckCircle,
  Refresh,
  Password
} from '@mui/icons-material';

// Import UserService
import UserService from '../../services/userService';
import { passFilterLogic } from '@mui/x-data-grid/internals';

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'active':
    case 'hoạt động':
      return 'success';
    case 'inactive':
    case 'không hoạt động':
      return 'warning';
    case 'blocked':
    case 'bị chặn':
      return 'error';
    default:
      return 'default';
  }
};

const getRoleColor = (role) => {
  switch (role?.toLowerCase()) {
    case 'admin':
      return 'error';
    case 'manager':
    case 'quản lý':
      return 'warning';
    case 'customer':
    case 'khách hàng':
      return 'primary';
    default:
      return 'default';
  }
};

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: 'Customer',
    status: 'Active'
  });

  // Load users when component mounts
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
  try {
    setLoading(true);
    setError(null);
    const userData = await UserService.getAllUsers();

    setUsers(Array.isArray(userData.data) ? userData.data : []);
  } catch (err) {
    setError('Không thể tải danh sách người dùng. Vui lòng thử lại.');
    console.error('Error loading users:', err);
  } finally {
    setLoading(false);
  }
};

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status?.toLowerCase() === statusFilter;
    const matchesRole = roleFilter === 'all' || user.role?.toLowerCase() === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  const handleMenuClick = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);

  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    // setSelectedUser(null);
  };

  const handleEdit = () => {
    setFormData({
      username: selectedUser?.username || '',
      email: selectedUser?.email || '',
      role: selectedUser?.role || 'Customer',
      phone: selectedUser?.phone || '',
      address: selectedUser?.address || '',
      // status: selectedUser?.status || 'Active'
    });
    setDialogType('edit');
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleAdd = () => {
    setFormData({
    username: '',
    email: '',
    role: 'Customer',
    phone: '',
    address: '',
    status: 'Active'
  });
    setDialogType('add');
    setOpenDialog(true);
  };

  const handleDelete = () => {
    setDialogType('delete');
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await UserService.changeUserStatus(selectedUser._id, newStatus);
      setSnackbar({
        open: true,
        message: 'Cập nhật trạng thái thành công!',
        severity: 'success'
      });
      loadUsers(); // Reload data
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Không thể cập nhật trạng thái người dùng.',
        severity: 'error'
      });
    }
    handleMenuClose();
  };

  const handleSubmit = async () => {
    try {
       const cleanData = {
      username: formData.username,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      password: formData.password,
      role: (formData.role || '').toLowerCase(),
 
    };
      if (dialogType === 'add') {
        await UserService.createUser(cleanData);
        setSnackbar({
          open: true,
          message: 'Thêm người dùng thành công!',
          severity: 'success'
        });
      } else if (dialogType === 'edit') {
        await UserService.updateUser(selectedUser._id, cleanData);
 
        setSnackbar({
          open: true,
          message: 'Cập nhật người dùng thành công!',
          severity: 'success'
        });
      } else if (dialogType === 'delete') {
        await UserService.deleteUser(selectedUser._id);
        setSnackbar({
          open: true,
          message: 'Xóa người dùng thành công!',
          severity: 'success'
        });
      }
      
      setOpenDialog(false);
      loadUsers(); // Reload data
    } catch (err) {
      setSnackbar({
        open: true,
        message: `Không thể ${dialogType === 'add' ? 'thêm' : dialogType === 'edit' ? 'cập nhật' : 'xóa'} người dùng.`,
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
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
            <Button color="inherit" size="small" onClick={loadUsers}>
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
          Quản lý người dùng
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={loadUsers}
            sx={{ textTransform: 'none' }}
          >
            Làm mới
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAdd}
            sx={{ textTransform: 'none' }}
          >
            Thêm người dùng
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Tìm kiếm người dùng..."
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
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
            <MenuItem value="blocked">Blocked</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Vai trò</InputLabel>
          <Select
            value={roleFilter}
            label="Vai trò"
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <MenuItem value="all">Tất cả</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="manager">Manager</MenuItem>
            <MenuItem value="customer">Customer</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      {/* Table Card */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa' }}>
                  Người dùng
                </TableCell>
                <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa' }}>
                  Vai trò
                </TableCell>
                <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa' }}>
                  Trạng thái
                </TableCell>
                <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa' }}>
                  Ngày tham gia
                </TableCell>
                <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa' }}>
                  Lần đăng nhập cuối
                </TableCell>
                <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa' }}>
                  Số Điện Thoại
                </TableCell>
                <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa' }}>
                  Địa chỉ
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 600, backgroundColor: '#f8f9fa' }}>
                  Hành động
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                <TableRow key={user._id} hover sx={{ '&:hover': { backgroundColor: '#f8f9fa' } }}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar 
                        sx={{ 
                          width: 40, 
                          height: 40, 
                          bgcolor: 'primary.light',
                          fontSize: '1rem',
                          fontWeight: 600
                        }}
                      >
                        {user.username?.charAt(0) || 'U'}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="600" sx={{ color: '#333' }}>
                          {user.username || 'N/A'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {user.email || 'N/A'}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.role || 'N/A'}
                      color={getRoleColor(user.role)}
                      size="small"
                      variant="outlined"
                      sx={{ fontWeight: 500 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.status || 'N/A'}
                      color={getStatusColor(user.status)}
                      size="small"
                      variant="filled"
                      sx={{ 
                        fontWeight: 500,
                        minWidth: 70
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: '#333' }}>
                      {user.joinDate || user.createdAt || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {user.lastLogin || user.updatedAt || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="600" sx={{ color: '#333' }}>
                      {user.phone || user.orderCount || 0}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="600" sx={{ color: '#333' }}>
                      {user.address || 0}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuClick(e, user)}
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
            count={filteredUsers.length}
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
        <MenuItem onClick={handleEdit}>
          <Edit sx={{ mr: 1, fontSize: 18 }} />
          Chỉnh sửa
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('Active')}>
          <CheckCircle sx={{ mr: 1, fontSize: 18 }} />
          Kích hoạt
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('Blocked')}>
          <Block sx={{ mr: 1, fontSize: 18 }} />
          Chặn
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 1, fontSize: 18 }} />
          Xóa
        </MenuItem>
      </Menu>

      {/* Dialog for Add/Edit/Delete */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>
          {dialogType === 'add' && 'Thêm người dùng mới'}
          {dialogType === 'edit' && 'Chỉnh sửa người dùng'}
          {dialogType === 'delete' && 'Xác nhận xóa'}
        </DialogTitle>
        <DialogContent>
          {dialogType === 'delete' ? (
            <Typography sx={{ py: 2 }}>
              Bạn có chắc chắn muốn xóa người dùng "{selectedUser?.username || selectedUser?.email || ''}"?
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
              <TextField
                label="Tên người dùng"
                fullWidth
                value={formData.username}
                onChange={(e) => handleFormChange('username', e.target.value)}
                variant="outlined"
                required
              />
              <TextField
                label="Email"
                type="email"
                fullWidth
                value={formData.email}
                onChange={(e) => handleFormChange('email', e.target.value)}
                variant="outlined"
                required
              />
              <TextField
                label="Phone"
                type="tel"
                fullWidth
                value={formData.phone}
                onChange={(e) => handleFormChange('phone', e.target.value)}
                variant="outlined"
                required
              />
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={formData.role}
                  label="Role"
                  onChange={(e) => handleFormChange('role', e.target.value)}
                >
                  <MenuItem value="Admin">admin</MenuItem>
                  <MenuItem value="Manager">manager</MenuItem>
                  <MenuItem value="Customer">customer</MenuItem>
                </Select>
              </FormControl>
                 <TextField
                label="Address"
                type="text"
                fullWidth
                value={formData.address}
                onChange={(e) => handleFormChange('address', e.target.value)}
                variant="outlined"
                required
              />
              <TextField
                label="Password"
                type="text"
                fullWidth
                value={formData.password}
                onChange={(e) => handleFormChange('password', e.target.value)}
                variant="outlined"
                required
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenDialog(false)} sx={{ textTransform: 'none' }}>
            Hủy
          </Button>
          <Button 
            variant="contained" 
            color={dialogType === 'delete' ? 'error' : 'primary'}
            onClick={handleSubmit}
            sx={{ textTransform: 'none' }}
          >
            {dialogType === 'add' && 'Thêm'}
            {dialogType === 'edit' && 'Cập nhật'}
            {dialogType === 'delete' && 'Xóa'}
          </Button>
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

export default UserTable;