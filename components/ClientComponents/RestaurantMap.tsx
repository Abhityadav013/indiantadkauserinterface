'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { Box, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for Leaflet icons in Next.js
const fixLeafletIcons = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
    });
};

// Dynamically import MapContainer-related components (no SSR)
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Tooltip = dynamic(() => import('react-leaflet').then(mod => mod.Tooltip), { ssr: false });

const lat = Number(process.env.NEXT_PUBLIC_INDIAN_TADKA_LAT);
const lng = Number(process.env.NEXT_PUBLIC_INDIAN_TADKA_LNG);

if (isNaN(lat) || isNaN(lng)) {
    throw new Error('Invalid or missing latitude/longitude environment variables');
}

const restaurantIcon = new L.Icon({
    iconUrl: 'https://testing.indiantadka.eu/assets/location-pin.png',
    iconSize: [40, 50],
    iconAnchor: [20, 50],
    popupAnchor: [0, -50],
    shadowSize: [41, 41],
    shadowAnchor: [13, 41],
});

export default function RestaurantMap() {
    const [mounted, setMounted] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        fixLeafletIcons();
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <Box
            sx={{
                width: '100%',         // fill parent width fully
                height: isMobile ? 250 : 400,  // match parent container height (400 on desktop)
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: 2,
            }}
        >
            <MapContainer
                center={[lat, lng]}
                zoom={16}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[lat, lng]} icon={restaurantIcon}>
                    <Tooltip direction="top" offset={[0, -30]} opacity={1} permanent={false}>
                        <Typography variant='body2' fontWeight="bold">
                            🍛 Here’s your favorite spot — Indian Tadka!
                        </Typography>
                    </Tooltip>
                </Marker>
            </MapContainer>
        </Box>
    );
}
