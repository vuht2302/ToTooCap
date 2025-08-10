import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tabs,
  Tab,
  Chip,
  Stack,
  Tooltip
} from '@mui/material';
import { 
  AttachMoney, 
  TrendingUp, 
  CalendarToday, 
  FilterList, 
  Download, 
  Refresh,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  ShowChart as LineChartIcon,
  Print,
  Share
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';
import vi from 'date-fns/locale/vi';

// Import custom components
import MetricCard from '../../components/admin/MetricCard';
import AdminLineChart from '../../components/admin/LineChart';
import AdminBarChart from '../../components/admin/BarChart';

// Sample data for revenue by product category
const revenueByCategory = [
  { name: 'Mũ lưỡi trai', value: 35 },
  { name: 'Mũ bucket', value: 25 },
  { name: 'Mũ snapback', value: 20 },
  { name: 'Mũ beanie', value: 15 },
  { name: 'Phụ kiện', value: 5 },
];

// Sample data for revenue by payment method
const revenueByPaymentMethod = [
  { name: 'Thẻ tín dụng', value: 45 },
  { name: 'Chuyển khoản', value: 30 },
  { name: 'Ví điện tử', value: 20 },
  { name: 'Tiền mặt', value: 5 },
];

// Sample data for top selling products
const topSellingProducts = [
  { 
    id: 1, 
    name: 'Mũ lưỡi trai classic', 
    category: 'Mũ lưỡi trai', 
    unitsSold: 245, 
    revenue: 12250000, 
    averagePrice: 50000,
    growth: 12.5
  },
  { 
    id: 2, 
    name: 'Mũ bucket đen trơn', 
    category: 'Mũ bucket', 
    unitsSold: 198, 
    revenue: 8910000, 
    averagePrice: 45000,
    growth: 8.3
  },
  { 
    id: 3, 
    name: 'Mũ snapback NY', 
    category: 'Mũ snapback', 
    unitsSold: 176, 
    revenue: 8800000, 
    averagePrice: 50000,
    growth: -2.1
  },
  { 
    id: 4, 
    name: 'Mũ beanie len', 
    category: 'Mũ beanie', 
    unitsSold: 154, 
    revenue: 6160000, 
    averagePrice: 40000,
    growth: 15.7
  },
  { 
    id: 5, 
    name: 'Mũ lưỡi trai thêu logo', 
    category: 'Mũ lưỡi trai', 
    unitsSold: 132, 
    revenue: 7920000, 
    averagePrice: 60000,
    growth: 5.2
  },
];

// Sample data for monthly revenue
const monthlyRevenueData = [
  { month: 'T1', revenue: 45000000, orders: 950, profit: 18000000 },
  { month: 'T2', revenue: 52000000, orders: 1050, profit: 20800000 },
  { month: 'T3', revenue: 48000000, orders: 980, profit: 19200000 },
  { month: 'T4', revenue: 61000000, orders: 1200, profit: 24400000 },
  { month: 'T5', revenue: 58000000, orders: 1150, profit: 23200000 },
  { month: 'T6', revenue: 65000000, orders: 1300, profit: 26000000 },
  { month: 'T7', revenue: 72000000, orders: 1450, profit: 28800000 },
  { month: 'T8', revenue: 68000000, orders: 1350, profit: 27200000 },
  { month: 'T9', revenue: 75000000, orders: 1500, profit: 30000000 },
  { month: 'T10', revenue: 82000000, orders: 1650, profit: 32800000 },
  { month: 'T11', revenue: 78000000, orders: 1550, profit: 31200000 },
  { month: 'T12', revenue: 95000000, orders: 1900, profit: 38000000 },
];

// Sample data for daily revenue (last 30 days)
const dailyRevenueData = Array.from({ length: 30 }, (_, i) => {
  const day = new Date();
  day.setDate(day.getDate() - (29 - i));
  return {
    date: format(day, 'dd/MM'),
    revenue: Math.floor(Math.random() * 5000000) + 1000000,
    orders: Math.floor(Math.random() * 100) + 20,
    profit: Math.floor(Math.random() * 2000000) + 400000
  };
});

// Custom PieChart component
const PieChart = ({ data, title }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const colors = ['#3f51b5', '#f44336', '#4caf50', '#ff9800', '#9c27b0', '#00bcd4'];

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          {data.map((item, index) => (
            <Box key={index}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">{item.name}</Typography>
                <Typography variant="body2" fontWeight="bold">{item.value}%</Typography>
              </Box>
              <Box sx={{ width: '100%', bgcolor: '#f5f5f5', borderRadius: 1, height: 8 }}>
                <Box
                  sx={{
                    width: `${item.value}%`,
                    bgcolor: colors[index % colors.length],
                    height: '100%',
                    borderRadius: 1,
                  }}
                />
              </Box>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const RevenueReport = () => {
  const [timeRange, setTimeRange] = useState('year');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all');

  // Calculate summary metrics
  const totalRevenue = 799000000; // Example: 799M VND
  const totalOrders = 15530;
  const averageOrderValue = totalRevenue / totalOrders;
  const profitMargin = 40; // 40%

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  const handleApplyFilters = () => {
    // In a real application, this would fetch filtered data
    console.log('Applying filters:', { timeRange, startDate, endDate, categoryFilter, paymentMethodFilter });
  };

  const handleResetFilters = () => {
    setTimeRange('year');
    setStartDate(null);
    setEndDate(null);
    setCategoryFilter('all');
    setPaymentMethodFilter('all');
  };

  const handleExportData = () => {
    // In a real application, this would export data to CSV/Excel
    console.log('Exporting data...');
  };

  const handlePrintReport = () => {
    // In a real application, this would print the report
    window.print();
  };

  return (
    <Box sx={{ p: 4, width: '100%', maxWidth: '100%' }}>
      {/* Header with title and actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h5" fontWeight="600" gutterBottom sx={{ color: '#333' }}>
            Báo Cáo Doanh Thu
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Xem và phân tích doanh thu của cửa hàng
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Tooltip title="Xuất báo cáo">
            <Button 
              variant="outlined" 
              startIcon={<Download />}
              onClick={handleExportData}
              size="small"
            >
              Xuất Excel
            </Button>
          </Tooltip>
          <Tooltip title="In báo cáo">
            <IconButton onClick={handlePrintReport}>
              <Print />
            </IconButton>
          </Tooltip>
          <Tooltip title="Chia sẻ báo cáo">
            <IconButton>
              <Share />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

      {/* Filter Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <FilterList sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6">Bộ lọc</Typography>
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Khoảng thời gian</InputLabel>
                <Select
                  value={timeRange}
                  label="Khoảng thời gian"
                  onChange={handleTimeRangeChange}
                >
                  <MenuItem value="today">Hôm nay</MenuItem>
                  <MenuItem value="yesterday">Hôm qua</MenuItem>
                  <MenuItem value="week">7 ngày qua</MenuItem>
                  <MenuItem value="month">Tháng này</MenuItem>
                  <MenuItem value="quarter">Quý này</MenuItem>
                  <MenuItem value="year">Năm nay</MenuItem>
                  <MenuItem value="custom">Tùy chỉnh</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {timeRange === 'custom' && (
              <>
                <Grid item xs={12} md={3}>
                  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                    <DatePicker
                      label="Từ ngày"
                      value={startDate}
                      onChange={(newValue) => setStartDate(newValue)}
                      renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                      slotProps={{ textField: { size: 'small', fullWidth: true } }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} md={3}>
                  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                    <DatePicker
                      label="Đến ngày"
                      value={endDate}
                      onChange={(newValue) => setEndDate(newValue)}
                      renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                      slotProps={{ textField: { size: 'small', fullWidth: true } }}
                    />
                  </LocalizationProvider>
                </Grid>
              </>
            )}
            
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Danh mục sản phẩm</InputLabel>
                <Select
                  value={categoryFilter}
                  label="Danh mục sản phẩm"
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <MenuItem value="all">Tất cả danh mục</MenuItem>
                  <MenuItem value="cap">Mũ lưỡi trai</MenuItem>
                  <MenuItem value="bucket">Mũ bucket</MenuItem>
                  <MenuItem value="snapback">Mũ snapback</MenuItem>
                  <MenuItem value="beanie">Mũ beanie</MenuItem>
                  <MenuItem value="accessories">Phụ kiện</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Phương thức thanh toán</InputLabel>
                <Select
                  value={paymentMethodFilter}
                  label="Phương thức thanh toán"
                  onChange={(e) => setPaymentMethodFilter(e.target.value)}
                >
                  <MenuItem value="all">Tất cả phương thức</MenuItem>
                  <MenuItem value="credit_card">Thẻ tín dụng</MenuItem>
                  <MenuItem value="bank_transfer">Chuyển khoản</MenuItem>
                  <MenuItem value="e_wallet">Ví điện tử</MenuItem>
                  <MenuItem value="cash">Tiền mặt</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button 
                  variant="outlined" 
                  startIcon={<Refresh />}
                  onClick={handleResetFilters}
                >
                  Đặt lại
                </Button>
                <Button 
                  variant="contained" 
                  startIcon={<FilterList />}
                  onClick={handleApplyFilters}
                >
                  Áp dụng
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Summary Metrics */}
      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard
            title="Tổng doanh thu"
            value={formatCurrency(totalRevenue)}
            change="12.5"
            changeType="increase"
            subtitle="vs kỳ trước"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard
            title="Tổng đơn hàng"
            value={totalOrders.toLocaleString()}
            change="8.3"
            changeType="increase"
            subtitle="vs kỳ trước"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard
            title="Giá trị đơn hàng trung bình"
            value={formatCurrency(averageOrderValue)}
            change="3.7"
            changeType="increase"
            subtitle="vs kỳ trước"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard
            title="Tỷ suất lợi nhuận"
            value={`${profitMargin}%`}
            change="1.5"
            changeType="increase"
            subtitle="vs kỳ trước"
          />
        </Grid>
      </Grid>

      {/* Tabs for different views */}
      <Box sx={{ mb: 4 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            '& .MuiTab-root': {
              minWidth: 'auto',
              px: 3
            }
          }}
        >
          <Tab 
            icon={<LineChartIcon sx={{ fontSize: 20 }} />} 
            iconPosition="start" 
            label="Tổng quan" 
          />
          <Tab 
            icon={<BarChartIcon sx={{ fontSize: 20 }} />} 
            iconPosition="start" 
            label="Theo thời gian" 
          />
          <Tab 
            icon={<PieChartIcon sx={{ fontSize: 20 }} />} 
            iconPosition="start" 
            label="Theo danh mục" 
          />
          <Tab 
            icon={<AttachMoney sx={{ fontSize: 20 }} />} 
            iconPosition="start" 
            label="Sản phẩm bán chạy" 
          />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {/* Overview Tab */}
      {tabValue === 0 && (
        <Grid container spacing={4}>
          <Grid item xs={12} lg={8}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Doanh thu theo tháng
                </Typography>
                <Box sx={{ width: '100%', height: 400 }}>
                  <AdminLineChart 
                    title="" 
                    data={monthlyRevenueData.map(item => ({
                      name: item.month,
                      revenue: item.revenue / 1000000, // Convert to millions
                      orders: item.orders
                    }))}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Grid container spacing={4} direction="column">
              <Grid item xs={12}>
                <PieChart 
                  data={revenueByCategory} 
                  title="Doanh thu theo danh mục" 
                />
              </Grid>
              <Grid item xs={12}>
                <PieChart 
                  data={revenueByPaymentMethod} 
                  title="Doanh thu theo phương thức thanh toán" 
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Top 5 sản phẩm bán chạy
                </Typography>
                <TableContainer component={Paper} elevation={0}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Sản phẩm</TableCell>
                        <TableCell>Danh mục</TableCell>
                        <TableCell align="right">Số lượng bán</TableCell>
                        <TableCell align="right">Doanh thu</TableCell>
                        <TableCell align="right">Giá trung bình</TableCell>
                        <TableCell align="right">Tăng trưởng</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {topSellingProducts.map((product) => (
                        <TableRow key={product.id} hover>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell align="right">{product.unitsSold.toLocaleString()}</TableCell>
                          <TableCell align="right">{formatCurrency(product.revenue)}</TableCell>
                          <TableCell align="right">{formatCurrency(product.averagePrice)}</TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                              {product.growth > 0 ? (
                                <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />
                              ) : (
                                <TrendingUp sx={{ fontSize: 16, color: 'error.main', transform: 'rotate(180deg)' }} />
                              )}
                              <Typography 
                                variant="body2" 
                                color={product.growth > 0 ? 'success.main' : 'error.main'}
                                fontWeight="medium"
                              >
                                {Math.abs(product.growth)}%
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Time-based Tab */}
      {tabValue === 1 && (
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Doanh thu theo ngày (30 ngày gần nhất)
                  </Typography>
                  <FormControl size="small" sx={{ minWidth: 150 }}>
                    <Select
                      value="daily"
                      size="small"
                    >
                      <MenuItem value="daily">Theo ngày</MenuItem>
                      <MenuItem value="weekly">Theo tuần</MenuItem>
                      <MenuItem value="monthly">Theo tháng</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Box sx={{ width: '100%', height: 400 }}>
                  <AdminBarChart 
                    title="" 
                    data={dailyRevenueData.map(item => ({
                      name: item.date,
                      sales: item.revenue / 1000000, // Convert to millions
                      profit: item.profit / 1000000 // Convert to millions
                    }))}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Doanh thu chi tiết theo ngày
                </Typography>
                <TableContainer component={Paper} elevation={0} sx={{ maxHeight: 400 }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>Ngày</TableCell>
                        <TableCell align="right">Doanh thu</TableCell>
                        <TableCell align="right">Số đơn hàng</TableCell>
                        <TableCell align="right">Lợi nhuận</TableCell>
                        <TableCell align="right">Tỷ suất lợi nhuận</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dailyRevenueData.map((day, index) => (
                        <TableRow key={index} hover>
                          <TableCell>{day.date}</TableCell>
                          <TableCell align="right">{formatCurrency(day.revenue)}</TableCell>
                          <TableCell align="right">{day.orders}</TableCell>
                          <TableCell align="right">{formatCurrency(day.profit)}</TableCell>
                          <TableCell align="right">
                            {Math.round((day.profit / day.revenue) * 100)}%
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Category Tab */}
      {tabValue === 2 && (
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <PieChart 
              data={revenueByCategory} 
              title="Doanh thu theo danh mục sản phẩm" 
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <PieChart 
              data={revenueByPaymentMethod} 
              title="Doanh thu theo phương thức thanh toán" 
            />
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Doanh thu theo danh mục chi tiết
                </Typography>
                <TableContainer component={Paper} elevation={0}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Danh mục</TableCell>
                        <TableCell align="right">Doanh thu</TableCell>
                        <TableCell align="right">Tỷ lệ</TableCell>
                        <TableCell align="right">Số lượng sản phẩm bán</TableCell>
                        <TableCell align="right">Số đơn hàng</TableCell>
                        <TableCell align="right">Tăng trưởng</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {revenueByCategory.map((category, index) => {
                        const revenue = Math.floor(totalRevenue * (category.value / 100));
                        const unitsSold = Math.floor(Math.random() * 1000) + 100;
                        const orders = Math.floor(unitsSold * 0.7);
                        const growth = Math.floor(Math.random() * 20) - 5;
                        
                        return (
                          <TableRow key={index} hover>
                            <TableCell>
                              <Typography variant="body2" fontWeight="medium">
                                {category.name}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">{formatCurrency(revenue)}</TableCell>
                            <TableCell align="right">{category.value}%</TableCell>
                            <TableCell align="right">{unitsSold.toLocaleString()}</TableCell>
                            <TableCell align="right">{orders.toLocaleString()}</TableCell>
                            <TableCell align="right">
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                                {growth > 0 ? (
                                  <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />
                                ) : (
                                  <TrendingUp sx={{ fontSize: 16, color: 'error.main', transform: 'rotate(180deg)' }} />
                                )}
                                <Typography 
                                  variant="body2" 
                                  color={growth > 0 ? 'success.main' : 'error.main'}
                                  fontWeight="medium"
                                >
                                  {Math.abs(growth)}%
                                </Typography>
                              </Box>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Top Products Tab */}
      {tabValue === 3 && (
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Sản phẩm bán chạy
                </Typography>
                <TableContainer component={Paper} elevation={0}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Sản phẩm</TableCell>
                        <TableCell>Danh mục</TableCell>
                        <TableCell align="right">Số lượng bán</TableCell>
                        <TableCell align="right">Doanh thu</TableCell>
                        <TableCell align="right">Giá trung bình</TableCell>
                        <TableCell align="right">Tăng trưởng</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {topSellingProducts.map((product) => (
                        <TableRow key={product.id} hover>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>
                            <Chip 
                              label={product.category} 
                              size="small" 
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell align="right">{product.unitsSold.toLocaleString()}</TableCell>
                          <TableCell align="right">{formatCurrency(product.revenue)}</TableCell>
                          <TableCell align="right">{formatCurrency(product.averagePrice)}</TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                              {product.growth > 0 ? (
                                <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />
                              ) : (
                                <TrendingUp sx={{ fontSize: 16, color: 'error.main', transform: 'rotate(180deg)' }} />
                              )}
                              <Typography 
                                variant="body2" 
                                color={product.growth > 0 ? 'success.main' : 'error.main'}
                                fontWeight="medium"
                              >
                                {Math.abs(product.growth)}%
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Phân tích xu hướng sản phẩm
                </Typography>
                <Box sx={{ width: '100%', height: 300 }}>
                  <AdminLineChart 
                    title="" 
                    data={monthlyRevenueData.map(item => ({
                      name: item.month,
                      revenue: item.revenue / 1000000, // Convert to millions
                      orders: item.orders
                    }))}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Phân tích lợi nhuận theo sản phẩm
                </Typography>
                <Box sx={{ width: '100%', height: 300 }}>
                  <AdminBarChart 
                    title="" 
                    data={topSellingProducts.map(product => ({
                      name: product.name.substring(0, 10) + '...',
                      sales: product.revenue / 1000000, // Convert to millions
                      profit: (product.revenue * 0.4) / 1000000 // Assuming 40% profit margin
                    }))}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default RevenueReport;