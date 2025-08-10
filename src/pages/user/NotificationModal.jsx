import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

const notifications = [
  { id: 'A0000', content: 'Đơn hàng đã thanh toán thành công', time: '5 Phút' },
  { id: 'A0000', content: 'Đơn hàng đã thanh toán thành công', time: '5 Phút' },
  { id: 'A0000', content: 'Đơn hàng đã thanh toán thành công', time: '5 Phút' },
  { id: 'A0000', content: 'Đơn hàng đã thanh toán thành công', time: '5 Phút' },
];

export default function NotificationModal({ open, onClose }) {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 360, p: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Notifications
        </Typography>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
          New
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <List>
          {notifications.map((item, idx) => (
            <ListItem key={idx} disableGutters sx={{ mb: 2 }}>
              <Box sx={{ width: '100%' }}>
                <Box display="flex" justifyContent="space-between">
                  <Typography fontWeight="bold">Đơn {item.id}</Typography>
                  <Typography fontSize="0.875rem" color="text.secondary">
                    {item.time}
                  </Typography>
                </Box>
                <Typography>{item.content}</Typography>
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
