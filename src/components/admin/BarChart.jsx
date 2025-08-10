import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Card, CardContent, Typography, Box } from '@mui/material';

const data = [
  { name: 'Jan', sales: 4000, profit: 2400 },
  { name: 'Feb', sales: 3000, profit: 1398 },
  { name: 'Mar', sales: 2000, profit: 9800 },
  { name: 'Apr', sales: 2780, profit: 3908 },
  { name: 'May', sales: 1890, profit: 4800 },
  { name: 'Jun', sales: 2390, profit: 3800 },
  { name: 'Jul', sales: 3490, profit: 4300 },
  { name: 'Aug', sales: 4000, profit: 2400 },
  { name: 'Sep', sales: 3000, profit: 1398 },
  { name: 'Oct', sales: 2000, profit: 9800 },
  { name: 'Nov', sales: 2780, profit: 3908 },
  { name: 'Dec', sales: 1890, profit: 4800 },
];

const AdminBarChart = ({ title = "Monthly Sales" }) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Box sx={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#666' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#666' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar 
                dataKey="sales" 
                fill="#3f51b5" 
                radius={[4, 4, 0, 0]}
                name="Sales"
              />
              <Bar 
                dataKey="profit" 
                fill="#4caf50" 
                radius={[4, 4, 0, 0]}
                name="Profit"
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AdminBarChart;