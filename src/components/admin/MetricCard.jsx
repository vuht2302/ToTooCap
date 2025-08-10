import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box
} from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

const MetricCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'increase', 
  subtitle 
}) => {
  const isIncrease = changeType === 'increase';
  
  return (
    <Card 
      sx={{ 
        height: '100%',
        width: '100%',
        backgroundColor: '#fff',
        border: '1px solid #e0e0e0',
        borderRadius: 2,
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        '&:hover': {
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }
      }}
    >
      <CardContent 
        sx={{ 
          p: 3,
          width: '100%'
        }}
      >
        <Box>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#666',
              fontSize: '0.875rem',
              fontWeight: 500,
              mb: 1
            }}
          >
            {title}
          </Typography>
          
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 'bold',
              color: '#333',
              mb: 1,
              fontSize: '2rem'
            }}
          >
            {value}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {change && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {isIncrease ? (
                  <TrendingUp sx={{ fontSize: 16, color: '#4caf50' }} />
                ) : (
                  <TrendingDown sx={{ fontSize: 16, color: '#f44336' }} />
                )}
                <Typography 
                  variant="body2" 
                  sx={{
                    color: isIncrease ? '#4caf50' : '#f44336',
                    fontWeight: 600,
                    fontSize: '0.875rem'
                  }}
                >
                  {change}%
                </Typography>
              </Box>
            )}
            
            {subtitle && (
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#999',
                  fontSize: '0.75rem'
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MetricCard;