import { Box, Skeleton } from '@mui/material';

export default function MenuItemSkeleton() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'stretch', p: 1.5, borderRadius: 2, boxShadow: 1, gap: 1.5, width: '100%', maxWidth: '100%', mb: 2 }}>
      <Skeleton variant="rectangular" width={100} height={100} sx={{ borderRadius: 2, flexShrink: 0 }} />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Skeleton variant="text" width="70%" height={28} />
          <Skeleton variant="text" width={40} height={28} />
        </Box>
        <Skeleton variant="text" width="90%" height={20} sx={{ mt: 1 }} />
        <Skeleton variant="text" width="60%" height={20} />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
          <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 2 }} />
        </Box>
      </Box>
    </Box>
  );
} 