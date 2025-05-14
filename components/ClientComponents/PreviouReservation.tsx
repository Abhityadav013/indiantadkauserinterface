"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  useTheme,
  Alert,
  Snackbar,
} from "@mui/material"
import { format } from "date-fns"
import UpdateReservation from "./UpdateReservation"
import { ReservationType } from "@/lib/types/reservation_type"
import toast from 'react-hot-toast';

export default function PreviousReservation() {
  const [bookings, setBookings] = useState<ReservationType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedBooking, setSelectedBooking] = useState<ReservationType | null>(null)
  const [updateModalOpen, setUpdateModalOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const ssid = localStorage.getItem('ssid');
      const _device_id = ssid || '';
      const response = await fetch("/api/v1/reservations", {
        headers: {
          "Content-Type": "application/json",
          ssid: _device_id,
        },
      })
      if (!response.ok) {
        throw new Error("Failed to fetch bookings")
      }
      const data = await response.json()
      setBookings(data.data)

    } catch (error) {
      console.error("Error fetching bookings:", error)
      setError(error instanceof Error ? error.message : "Failed to load bookings")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateClick = (booking: ReservationType) => {
    const updateBooking ={
      ...booking,
      phoneNumber:phoneNumberWithoutCountryCode(booking.phoneNumber)
    }
    setSelectedBooking(updateBooking)
    setUpdateModalOpen(true)
  }

  const handleDeleteClick = (booking: ReservationType) => {
    setSelectedBooking(booking)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedBooking) return

    try {
      const ssid = localStorage.getItem('ssid');
      const _device_id = ssid || '';
      const response = await fetch(`/api/v1/reservations/${selectedBooking.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ssid: _device_id,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete booking")
      }

      // Remove the deleted booking from the state
      setBookings(bookings.filter((booking) => booking.id !== selectedBooking.id))
      toast.success(`Reservation deleted successfully.`, {
        duration: 3000, // Show toast for 2 seconds
        style: {
          padding: "16px 24px", // Adjusted padding
          height: "60px", // Fixed height
          fontSize: "16px", // Fixed font size
          backgroundColor: "#28a745", // Green color for success
          color: "#fff", // White text
          borderRadius: "10px",
          marginTop: '50px'
        },
        iconTheme: {
          primary: "#fff", // White icon
          secondary: "#28a745", // Green icon
        },
      });
    } catch (error) {
      console.error("Error deleting booking:", error)
    } finally {
      setDeleteDialogOpen(false)
      setSelectedBooking(null)
    }
  }

  const handleUpdateSuccess = (updatedBooking: ReservationType) => {
    // Update the booking in the state
    setBookings(bookings.map((booking) => (booking.id === updatedBooking.id ? updatedBooking : booking)))
    setUpdateModalOpen(false)
    setSelectedBooking(null)
  }

  if (loading) {
    return (
      <Box className="flex justify-center items-center p-12">
        <CircularProgress />
        <span className="ml-3">Loading your bookings...</span>
      </Box>
    )
  }

  if (error) {
    return (
      <Box className="p-6">
        <Alert severity="error">{error}</Alert>
      </Box>
    )
  }

  if (bookings.length === 0) {
    return (
      <Box className="p-6 text-center">
        <Typography variant="h6" className="mb-4">
          No Previous Bookings
        </Typography>
        <Typography variant="body1" className="text-gray-600">
          You haven't made any reservations yet. Use the form to book your first table!
        </Typography>
      </Box>
    )
  }

  const formatPhoneNumber = (phone: string): string => {
    // Remove any non-digit characters like '+' or spaces
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d+)$/); // e.g., '49' and the rest
    if (!match) return phone;
    return `+${match[1]}- ${match[2]}`;
  }

  const phoneNumberWithoutCountryCode = (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d+)$/); // e.g., '49' and the rest
    if (!match) return phone;
    return `${match[2]}`;
  }

  return (
    <Box className="p-6">
      <Typography variant="h6" className="mb-4">
        Your Previous Bookings
      </Typography>

      {isMobile ? (
        // Mobile card view
        <div className="space-y-4">
          {bookings.map((booking) => (
            <Card key={booking.displayId} className="shadow-md">
              <CardContent>
                <Typography variant="h6" className="font-medium">
                  {booking.fullName}
                </Typography>
                <div className="mt-2 space-y-1">
                  <Typography variant="body2" className="text-gray-600">
                    <span className="font-medium">Date:</span>{" "}
                    {format(new Date(booking.reservationDateTime), "MMMM d, yyyy")}
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    <span className="font-medium">Time:</span> {format(new Date(booking.reservationDateTime), "h:mm a")}
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    <span className="font-medium">People:</span> {booking.numberOfPeople}
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    <span className="font-medium">Phone:</span> {formatPhoneNumber(booking.phoneNumber)}
                  </Typography>
                </div>
              </CardContent>
              <CardActions className="justify-end px-4 pb-3">
                <Button size="small" variant="outlined" color="primary" onClick={() => handleUpdateClick(booking)}>
                  Update
                </Button>
                <Button size="small" variant="outlined" color="error" onClick={() => handleDeleteClick(booking)}>
                  Delete
                </Button>
              </CardActions>
            </Card>
          ))}
        </div>
      ) : (
        // Desktop table view
        <TableContainer component={Paper} className="shadow-md">
          <Table>
            <TableHead className="bg-gray-50">
              <TableRow>
                <TableCell className="font-medium">Name</TableCell>
                <TableCell className="font-medium">Date</TableCell>
                <TableCell className="font-medium">Time</TableCell>
                <TableCell className="font-medium">People</TableCell>
                <TableCell className="font-medium">Phone</TableCell>
                <TableCell className="font-medium" align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id} hover>
                  <TableCell>{booking.fullName}</TableCell>
                  <TableCell>{format(new Date(booking.reservationDateTime), "MMMM d, yyyy")}</TableCell>
                  <TableCell>{format(new Date(booking.reservationDateTime), "h:mm a")}</TableCell>
                  <TableCell>{booking.numberOfPeople}</TableCell>
                  <TableCell>{formatPhoneNumber(booking.phoneNumber)}</TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      className="mr-2"
                      onClick={() => handleUpdateClick(booking)}
                    >
                      Update
                    </Button>
                    <Button size="small" variant="outlined" color="error" onClick={() => handleDeleteClick(booking)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Update Modal */}
      {selectedBooking && (
        <UpdateReservation
          open={updateModalOpen}
          booking={selectedBooking}
          onClose={() => {
            setUpdateModalOpen(false)
            setSelectedBooking(null)
          }}
          onSuccess={handleUpdateSuccess}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this reservation? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
