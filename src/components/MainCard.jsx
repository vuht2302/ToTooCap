import React from 'react';
import { Card, CardContent } from '@mui/material';

const MainCard = ({ 
  children, 
  content = true, 
  sx = {}, 
  ...other 
}) => {
  return (
    <Card
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        ...sx
      }}
      {...other}
    >
      {content ? (
        <CardContent>
          {children}
        </CardContent>
      ) : (
        children
      )}
    </Card>
  );
};

export default MainCard;