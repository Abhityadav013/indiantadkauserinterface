'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    IconButton,
    useTheme,
    Box,
} from '@mui/material';
import Image from 'next/image';
import { Close } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface TruncatedDescriptionProps {
    name: string;
    price: number;
    description: string;
    imageUrl: string;
}

export default function TruncatedDescription({
    name,
    price,
    description,
    imageUrl,
}: TruncatedDescriptionProps) {
    const [open, setOpen] = useState(false);
    const isMobile = useSelector((state: RootState) => state.mobile.isMobile);
    const theme = useTheme();

    return (
        <>
            {/* Description with 2-line clamp and info icon right after ellipsis */}
            {isMobile ? (
                <Typography
                    variant="body2"
                    component="div"
                    sx={{
                        position: 'relative',
                        color: theme.palette.text.secondary,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        paddingRight: '28px', // space for the info icon
                        lineHeight: 1.4,
                        fontSize: '0.875rem', // smaller for description
                        userSelect: 'text',
                    }}
                >
                    {description}
                    {/* <IconButton
                        onClick={() => setOpen(true)}
                        size="small"
                        sx={{
                            position: 'absolute',
                            right: 0,
                            bottom: 0,
                            color: '#388e3c', // green color
                            '& svg': {
                                fontSize: { xs: '14px', sm: '14px', md: '20px' }, // smaller on mobile (16px), default on desktop (20px)
                            },
                        }}
                        aria-label={`More info about ${name}`}
                    >
                        <Info fontSize="small" />
                    </IconButton> */}
                </Typography>
            ) : (
                // Desktop view: show truncated to 150 chars with button next to it
                <Typography variant="body2" component="div" sx={{ color: theme.palette.text.secondary, maxWidth: '80%', fontSize: '0.875rem', lineHeight: 1.4, position: 'relative' }}>
                    {description.length > 80
                        ? `${description.slice(0, 80).trim()}...`
                        : description}
                    {/* <Button
                        variant="text"
                        color="success"
                        onClick={() => setOpen(true)}
                        startIcon={<Info sx={{ fontSize: '18px' }} />}
                        sx={{ textTransform: 'none'}}
                    /> */}

                </Typography>
            )}

            {/* Full screen dialog with description */}
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle component="div" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {name}
                    </Typography>
                    <IconButton onClick={() => setOpen(false)} aria-label="Close dialog">
                        <Close />
                    </IconButton>
                </DialogTitle>

                <DialogContent>
                    <Box sx={{ mb: 4, position: 'relative', height: 256, width: '100%' }}>
                        <Image
                            src={imageUrl || '/placeholder.svg?height=400&width=600'}
                            alt={name}
                            fill
                            className="object-cover rounded-lg"
                        />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                            {price.toFixed(2)}€
                        </Typography>
                    </Box>

                    <Typography variant="body1" sx={{ mb: 4 }}>
                        {description}
                    </Typography>

                    <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mb: 1 }}>
                            Allergic Information
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Information not available. Please ask our staff for details.
                        </Typography>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
}
