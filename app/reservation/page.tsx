
"use client"

import type React from "react"

import { useState } from "react"
import ReservationForm from "@/components/ClientComponents/ReservationForm"
import NavBarNavigation from "@/components/NavBarNavigation"
import { Container, Paper, Tabs, Tab, Box } from "@mui/material"
import PreviousReservation from "@/components/ClientComponents/PreviouReservation"

interface TabPanelProps {
    children?: React.ReactNode
    index: number
    value: number
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`reservation-tabpanel-${index}`}
            aria-labelledby={`reservation-tab-${index}`}
            {...other}
            className="mt-6"
        >
            {value === index && <Box>{children}</Box>}
        </div>
    )
}


export default function ReservationPage() {
    const [tabValue, setTabValue] = useState(0)

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue)
    }

    return (
        <Box
            component="section"
            sx={{
                overflow: 'auto',
                backgroundColor: '#e9ecee',
                padding: 2,
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: 2,
            }}
        >
            <NavBarNavigation label="Reservation" isImage={false} />
            <Container maxWidth="lg" className="relative z-10 mt-15">
                <Paper elevation={3} className="bg-white/90 backdrop-blur-sm rounded-lg overflow-hidden">
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }} className="px-4">
                        <Tabs value={tabValue} onChange={handleTabChange} aria-label="reservation tabs" variant="fullWidth">
                            <Tab label="Make a Reservation" id="reservation-tab-0" aria-controls="reservation-tabpanel-0" />
                            <Tab label="View Previous Bookings" id="reservation-tab-1" aria-controls="reservation-tabpanel-1" />
                        </Tabs>
                    </Box>

                    <TabPanel value={tabValue} index={0}>
                        <ReservationForm />
                    </TabPanel>

                    <TabPanel value={tabValue} index={1}>
                        <PreviousReservation />
                    </TabPanel>
                </Paper>
            </Container>
            {/* <ReservationForm /> */}
        </Box>
    )
}
