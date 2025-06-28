'use client';

import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Container,
  Alert,
  AlertTitle,
  Divider
} from '@mui/material';
import { 
  Refresh as RefreshIcon,
  Restaurant as RestaurantIcon,
  ErrorOutline as ErrorIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

interface ErrorFallbackProps {
  error?: Error;
  resetError?: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ 
  error, 
  resetError
}) => {
  const router = useRouter();

  const handleReload = () => {
    if (resetError) {
      resetError();
    } else {
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    router.push('/');
  };

  // Always show the same user-friendly message regardless of error type
  const userMessage = {
    title: 'Seite wird geladen...',
    subtitle: 'Es gab ein Problem beim Laden der Seite',
    description: 'Bitte laden Sie die Seite neu, um fortzufahren.'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center p-4">
      <Container maxWidth="sm">
        <Paper 
          elevation={8}
          sx={{
            p: { xs: 3, md: 4 },
            textAlign: 'center',
            borderRadius: 4,
            background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
            border: '2px solid #f36805',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #f36805, #e55a00)',
            }
          }}
        >
          {/* Header with Restaurant Icon */}
          <Box sx={{ mb: { xs: 2, md: 3 } }}>
            <RestaurantIcon 
              sx={{ 
                fontSize: { xs: 48, md: 64 }, 
                color: '#f36805',
                mb: 2 
              }} 
            />
            <Typography 
              variant="h4" 
              component="h1"
              sx={{ 
                fontWeight: 700,
                color: '#2c3e50',
                mb: 1,
                fontFamily: 'var(--font-outfit)',
                fontSize: { xs: '1.75rem', md: '2.125rem' }
              }}
            >
              IndianTadka
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#7f8c8d',
                fontStyle: 'italic',
                fontSize: { xs: '0.875rem', md: '1rem' }
              }}
            >
              Authentische indische Küche in Deutschland
            </Typography>
          </Box>

          <Divider sx={{ my: { xs: 2, md: 3 } }} />

          {/* Error Content */}
          <Box sx={{ mb: { xs: 3, md: 4 } }}>
            <ErrorIcon 
              sx={{ 
                fontSize: { xs: 40, md: 48 }, 
                color: '#e74c3c',
                mb: 2 
              }} 
            />
            
            <Typography 
              variant="h5" 
              component="h2"
              sx={{ 
                fontWeight: 600,
                color: '#2c3e50',
                mb: 2,
                fontFamily: 'var(--font-outfit)',
                fontSize: { xs: '1.25rem', md: '1.5rem' }
              }}
            >
              {userMessage.title}
            </Typography>
            
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#7f8c8d',
                mb: 2,
                fontWeight: 400,
                fontSize: { xs: '1rem', md: '1.25rem' }
              }}
            >
              {userMessage.subtitle}
            </Typography>
            
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#5a6c7d',
                mb: 3,
                lineHeight: 1.6,
                fontSize: { xs: '0.875rem', md: '1rem' }
              }}
            >
              {userMessage.description}
            </Typography>

            {/* Technical Details (ONLY in development mode) */}
            {process.env.NODE_ENV === 'development' && error && (
              <Alert 
                severity="info" 
                sx={{ 
                  mt: 2, 
                  textAlign: 'left',
                  '& .MuiAlert-message': { fontFamily: 'monospace' }
                }}
              >
                <AlertTitle>Technical Details (Development Only)</AlertTitle>
                {error.message}
              </Alert>
            )}
          </Box>

          {/* Action Buttons */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            justifyContent: 'center'
          }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<RefreshIcon />}
              onClick={handleReload}
              sx={{
                backgroundColor: '#f36805',
                color: 'white',
                px: { xs: 3, md: 4 },
                py: { xs: 1.25, md: 1.5 },
                borderRadius: 2,
                fontWeight: 600,
                textTransform: 'none',
                fontSize: { xs: '1rem', md: '1.1rem' },
                '&:hover': {
                  backgroundColor: '#e55a00',
                },
                minWidth: { xs: '100%', sm: 'auto' }
              }}
            >
              Seite neu laden
            </Button>
            
            <Button
              variant="outlined"
              size="large"
              startIcon={<HomeIcon />}
              onClick={handleGoHome}
              sx={{
                borderColor: '#f36805',
                color: '#f36805',
                px: { xs: 3, md: 4 },
                py: { xs: 1.25, md: 1.5 },
                borderRadius: 2,
                fontWeight: 600,
                textTransform: 'none',
                fontSize: { xs: '1rem', md: '1.1rem' },
                '&:hover': {
                  borderColor: '#e55a00',
                  backgroundColor: 'rgba(243, 104, 5, 0.04)',
                },
                minWidth: { xs: '100%', sm: 'auto' }
              }}
            >
              Zur Startseite
            </Button>
          </Box>

          {/* Footer */}
          <Box sx={{ 
            mt: { xs: 3, md: 4 }, 
            pt: { xs: 2, md: 3 }, 
            borderTop: '1px solid #e0e0e0' 
          }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#95a5a6',
                fontStyle: 'italic',
                fontSize: { xs: '0.75rem', md: '0.875rem' }
              }}
            >
              Bei anhaltenden Problemen kontaktieren Sie uns unter{' '}
              <Box 
                component="span" 
                sx={{ 
                  color: '#f36805',
                  fontWeight: 600
                }}
              >
                support@indiantadka.eu
              </Box>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </div>
  );
};

export default ErrorFallback; 