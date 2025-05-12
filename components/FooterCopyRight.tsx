import React from 'react';
import { Box, Divider, Typography } from '@mui/material';

const FooterCopyRights = () => {
    return (
        <Box
            component="footer"
            sx={{
                fontWeight: 'bold',
                paddingTop: 3,
                px: 1,
                // position: 'sticky',
                bottom: 0,
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
            }}
        >
            <Divider sx={{ width: { xs: '80%', sm: '80%', lg: '60%' }, mb: 1 }} />
            <Typography
                sx={{
                    fontSize: { xs: '0.6rem', sm: '0.6rem', lg: '0.6rem' },
                    textAlign: 'center',
                }}
            >
                © 2025 IndianTadka.com - All Rights Reserved
            </Typography>
        </Box>
    );
};

export default FooterCopyRights;
