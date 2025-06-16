import React from 'react';
import { Box, Skeleton, Typography, Stack, Divider } from '@mui/material';

const SkeletonSidebar = () => {

    return (
        <Box
            sx={{
                position: 'sticky',
                top: 0,
                width: { xs: '100%', sm: '100%', md: 500, lg: 500 },
                px: 2,
                py: 3,
                bgcolor: 'background.paper',
                height: '100vh',
                borderLeft: '1px solid #eee',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                mx: 'auto',
                zIndex: 1200,
            }}
        >
            {/* Scrollable main content */}
            <Box sx={{ overflowY: 'auto', flexGrow: 1 }}>
                {/* Basket Header */}
                <Typography variant="h6" fontWeight="bold" display="flex" justifyContent="center">
                    Basket
                </Typography>

                {/* Delivery / Collection Toggle */}
                <Stack direction="row" spacing={2} my={3} justifyContent="center">
                    <Skeleton variant="rounded" width={100} height={36} />
                    <Skeleton variant="rounded" width={100} height={36} />
                </Stack>

                {/* Simulated Item List */}
                <Stack spacing={2} mb={4}>
                    {[1, 2, 3].map((_, idx) => (
                        <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box flexGrow={1}>
                                <Skeleton variant="text" width="80%" height={24} />
                                <Skeleton variant="text" width="60%" height={20} />
                            </Box>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Skeleton variant="circular" width={30} height={30} />
                                <Skeleton variant="text" width={20} height={24} />
                                <Skeleton variant="circular" width={30} height={30} />
                            </Stack>
                            <Skeleton variant="text" width={40} height={24} />
                        </Box>
                    ))}
                </Stack>
            </Box>

            {/* Fixed bottom section */}
            <Box>
                <Divider sx={{ mb: 3 }} />
                <Typography variant="subtitle1" mb={1}>
                    <Skeleton width="40%" />
                </Typography>
                <Skeleton variant="text" width="80%" height={24} />
                <Skeleton variant="text" width="60%" height={24} />
                <Skeleton variant="text" width="50%" height={24} />
                <Box mt={3}>
                    <Skeleton variant="rounded" width="100%" height={48} />
                </Box>
            </Box>
        </Box>

    );
};

export default SkeletonSidebar;
