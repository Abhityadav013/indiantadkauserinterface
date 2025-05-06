import { Card, CardContent } from '@mui/material';
import Image from 'next/image';
import React from 'react';

interface LoaderProps {
    loadingImage: string; // Image URL passed as a prop
    isLoading: boolean;   // Flag to indicate loading state
}

const Loader: React.FC<LoaderProps> = ({ loadingImage, isLoading }) => {
    if (!isLoading) return null; // Don't display the loader when not loading

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
            <Card
                elevation={0}
                className="rounded-lg bg-transparent p-4"
                sx={{ backgroundColor: 'transparent', boxShadow: 'none' }} // Ensures no MUI shadow
            >
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <Image
                        src={loadingImage}
                        alt="Loading..."
                        width={400}
                        height={400} // Assuming the image is square
                    />
                </CardContent>
            </Card>
        </div>
    );
};

export default Loader;
