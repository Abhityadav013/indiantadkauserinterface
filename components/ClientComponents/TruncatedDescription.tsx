'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    IconButton,
    Button,
} from '@mui/material';
import Image from 'next/image';
import { Close, Info } from '@mui/icons-material';

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

    return (
        <>
            <Typography variant="body2" className="text-gray-700 w-[70%]">
                {description}
                <Button
                    variant="text"
                    color="primary"
                    onClick={() => setOpen(true)}
                    startIcon={<Info />}
                    className="text-primary hover:bg-gray-100"
                />
            </Typography>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle component="div" className="flex justify-between items-center">
                    <Typography variant="h6" className="font-bold">
                        {name}
                    </Typography>
                    <IconButton onClick={() => setOpen(false)}>
                        <Close />
                    </IconButton>
                </DialogTitle>

                <DialogContent>
                    <div className="mb-4 relative h-64 w-full">
                        <Image
                            src={imageUrl || "/placeholder.svg?height=400&width=600"}
                            alt={name}
                            fill
                            className="object-cover rounded-lg"
                        />
                    </div>

                    <div className="flex justify-between items-center mb-4">
                        <Typography variant="h5" component="p" className="font-bold">
                            ${price.toFixed(2)}
                        </Typography>
                    </div>

                    <Typography variant="body1" className="mb-4">
                        {description}
                    </Typography>

                    <div className="p-4 bg-gray-100 rounded-lg">
                        <Typography variant="subtitle1" className="font-medium mb-2">
                            Allergic Information
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Information not available. Please ask our staff for details.
                        </Typography>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
