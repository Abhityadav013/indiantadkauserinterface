"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Paper,
  Tabs,
  Tab,
  Skeleton
} from "@mui/material"
import NavBarNavigation from "@/components/NavBarNavigation"
// import ReservationForm from "@/components/ClientComponents/ReservationForm"
// import PreviousReservation from "@/components/ClientComponents/PreviouReservation"
import { useTranslations } from "next-intl"
import dynamic from "next/dynamic"

const ReservationForm = dynamic(() => import('@/components/ClientComponents/ReservationForm'), {
  loading: () => <Skeleton height={300} />,
  ssr: false, // if it's purely client side
})
const PreviousReservation = dynamic(() => import('@/components/ClientComponents/PreviouReservation'), {
  loading: () => <Skeleton height={300} />,
  ssr: false,
})

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`reservation-tabpanel-${index}`}
      aria-labelledby={`reservation-tab-${index}`}
      className="mt-6"
    >
      {value === index && <Box>{children}</Box>}
    </div>
  )
}

export default function ReservationPage() {
  const t = useTranslations("reservation")
  const [tabValue, setTabValue] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 10)
    return () => clearTimeout(timer)
  }, [])

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  return (
    <Box
      component="section"
      sx={{
        backgroundColor: '#e9ecee',
        minHeight: '100vh',
        width: '100%',
        mt: 8,
        py: { xs: 2, sm: 4 },
        px: { xs: 1, sm: 2, md: 4 },
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <NavBarNavigation label="Reservation" isImage={false} />

      <Box
        sx={{
          width: '100%',
          maxWidth: '1000px',
          mx: 'auto',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            backgroundColor: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(8px)',
            borderRadius: 2,
            overflow: 'hidden',
            px: { xs: 2, sm: 4 },
            py: { xs: 3, sm: 4 },
          }}
        >
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="reservation tabs"
              variant="fullWidth"
            >
              <Tab label={t('type_one')} id="reservation-tab-0" aria-controls="reservation-tabpanel-0" />
              <Tab label={t('type_two')} id="reservation-tab-1" aria-controls="reservation-tabpanel-1" />
            </Tabs>
          </Box>

          {loading ? (
            <Box sx={{ pt: 4 }}>
              <Skeleton variant="text" height={60} width="60%" sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" height={250} width="100%" />
            </Box>
          ) : (
            <Box sx={{ mt: 2, mb: 4 }}>
              <TabPanel value={tabValue} index={0}>
                <ReservationForm />
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <PreviousReservation />
              </TabPanel>
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  )
}
