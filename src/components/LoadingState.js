import React from 'react';
import { Box, Skeleton, Paper } from '@mui/material';

function LoadingState({ type = 'table', count = 4 }) {
  if (type === 'table') {
    return (
      <Paper sx={{ p: 2 }}>
        <Skeleton height={40} sx={{ mb: 2 }} />
        {Array(count).fill(0).map((_, index) => (
          <Skeleton key={index} height={52} sx={{ my: 1 }} />
        ))}
      </Paper>
    );
  }

  if (type === 'form') {
    return (
      <Box sx={{ p: 2 }}>
        {Array(count).fill(0).map((_, index) => (
          <Skeleton key={index} height={60} sx={{ my: 2 }} />
        ))}
      </Box>
    );
  }

  return <Skeleton height={400} />;
}

export default LoadingState; 