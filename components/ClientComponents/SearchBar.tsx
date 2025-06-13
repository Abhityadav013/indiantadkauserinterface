'use client';

import { useEffect, useState } from 'react';
import { TextField, InputAdornment } from '@mui/material';
import { Search } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SearchBar() {
    const isMobile = useSelector((state: RootState) => state.mobile.isMobile);

    const router = useRouter();
    const searchParams = useSearchParams();
    const qParam = searchParams.get('q') || '';
    const [searchTerm, setSearchTerm] = useState(qParam);

    // Debounce input and update URL query param to trigger server render
    useEffect(() => {
        const handler = setTimeout(() => {
            const params = new URLSearchParams(window.location.search);
            if (searchTerm) {
                params.set('q', searchTerm);
                params.delete('category'); // optional: remove category when searching
            } else {
                params.delete('q');
            }
            router.replace(`/menu-list?${params.toString()}`, { scroll: false });
        }, 20);

        return () => clearTimeout(handler);
    }, [searchTerm, router]);

    return (
        <div>
            <TextField
                fullWidth
                placeholder="Search your food..."
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search />
                        </InputAdornment>
                    ),
                }}
                sx={{
                    mt: { xs: 0, sm: 0, lg: 10 },
                    display: 'flex',
                    justifyContent: 'center',
                    width: isMobile ? '100%' : '70%',
                    backgroundColor: '#fff',
                    borderRadius: '9999px',
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '9999px',
                        '& fieldset': {
                            borderColor: '#FF6347',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#FF6347',   // override blue border on focus
                        },
                    },
                }}
            />
        </div>

    );
}
