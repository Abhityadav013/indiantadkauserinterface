"use client"

import type React from "react"

import { useState } from "react"
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    FormControl,
    FormHelperText,
    CircularProgress,
} from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers"
import { TimePicker } from "@mui/x-date-pickers"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { isValid, isMonday, parse, isWithinInterval } from "date-fns"
import { CountryCode, getCountryCallingCode } from "libphonenumber-js"
import PhoneInput from "./PhoneInput"
import { ReservationType } from "@/lib/types/reservation_type"
import toast from 'react-hot-toast';


interface UpdateBookingModalProps {
    open: boolean
    booking: ReservationType
    onClose: () => void
    onSuccess: (updatedBooking: ReservationType) => void
}

interface FormErrors {
    fullName?: string
    phoneNumber?: string
    numberOfPeople?: string
    reservationDate?: string
    reservationTime?: string
}

export default function UpdateReservation({ open, booking, onClose, onSuccess }: UpdateBookingModalProps) {
    const reservationDate = new Date(booking.reservationDateTime)
    const [formData, setFormData] = useState({
        fullName: booking.fullName,
        phoneNumber: booking.phoneNumber,
        numberOfPeople: booking.numberOfPeople,
        reservationDate: reservationDate,
        reservationTime: reservationDate,
    })
    const [selectedCountry] = useState<CountryCode>("DE");
    const [phoneNumber, setPhoneNumber] = useState<string>(booking.phoneNumber ?? "");

    const [errors, setErrors] = useState<FormErrors>({})
    const [submitting, setSubmitting] = useState(false)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })

        // Clear error when user types
        if (errors[name as keyof FormErrors]) {
            setErrors({ ...errors, [name]: undefined })
        }
    }

    const handleDateChange = (date: Date | null) => {
        if (date) {
            setFormData({ ...formData, reservationDate: date })
            if (errors.reservationDate) {
                setErrors({ ...errors, reservationDate: undefined })
            }
        }
    }

    const handleTimeChange = (time: Date | null) => {
        if (time) {
            setFormData({ ...formData, reservationTime: time })
            if (errors.reservationTime) {
                setErrors({ ...errors, reservationTime: undefined })
            }
        }
    }

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {}

        // Validate full name
        if (!formData.fullName.trim()) {
            newErrors.fullName = "Full name is required"
        }

        // Validate number of people
        if (!formData.numberOfPeople) {
            newErrors.numberOfPeople = "Number of people is required"
        }

        // Validate reservation date
        if (!formData.reservationDate) {
            newErrors.reservationDate = "Reservation date is required"
        } else if (!isValid(formData.reservationDate)) {
            newErrors.reservationDate = "Please select a valid date"
        } else if (isMonday(formData.reservationDate)) {
            newErrors.reservationDate = "We are closed on Mondays"
        }

        // Validate reservation time
        if (!formData.reservationTime) {
            newErrors.reservationTime = "Reservation time is required"
        } else if (!isValid(formData.reservationTime)) {
            newErrors.reservationTime = "Please select a valid time"
        } else {
            // Check if time is within allowed ranges
            const time = formData.reservationTime
            const hours = time.getHours()
            const minutes = time.getMinutes()

            const lunchStart = parse("11:00", "HH:mm", new Date())
            const lunchEnd = parse("14:30", "HH:mm", new Date())
            const dinnerStart = parse("17:00", "HH:mm", new Date())
            const dinnerEnd = parse("21:00", "HH:mm", new Date())

            const timeToCheck = parse(`${hours}:${minutes}`, "HH:mm", new Date())

            const isLunchTime = isWithinInterval(timeToCheck, { start: lunchStart, end: lunchEnd })
            const isDinnerTime = isWithinInterval(timeToCheck, { start: dinnerStart, end: dinnerEnd })

            if (!isLunchTime && !isDinnerTime) {
                newErrors.reservationTime = "Reservations are only available between 11:00 AM - 2:30 PM and 5:00 PM - 9:00 PM"
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async () => {
        if (!validateForm()) {
            return
        }

        setSubmitting(true)

        try {
            // Combine date and time for the API
            const combinedDateTime = new Date(formData.reservationDate)
            combinedDateTime.setHours(formData.reservationTime.getHours(), formData.reservationTime.getMinutes())
            const ssid = localStorage.getItem('ssid');
            const _device_id = ssid || '';

            const response = await fetch(`/api/v1/reservations/${booking.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ssid: _device_id,
                },
                body: JSON.stringify({
                    fullName: formData.fullName,
                    phoneNumber: `+${getCountryCallingCode(selectedCountry)}${phoneNumber}`,
                    numberOfPeople: formData.numberOfPeople,
                    reservationDateTime: combinedDateTime.toISOString(),
                }),
            })
          
            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || "Failed to update booking")
            }

            const data = await response.json()
            onSuccess(data.data)
            toast.success(`Reservation updated successfully.`, {
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
            console.error("Error updating booking:", error)
            // You could add error handling here
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogTitle>Update Reservation</DialogTitle>
                <DialogContent>
                    <div className="mt-4 space-y-6">
                        <div className="mb-4">
                            <TextField
                                label="Full Name"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                fullWidth
                                error={!!errors.fullName}
                                helperText={errors.fullName}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <PhoneInput
                                phoneNumber={phoneNumber}
                                setPhoneNumber={setPhoneNumber}
                                selectedCountry={selectedCountry}
                            />
                        </div>

                        <div className="mb-4">
                            <TextField
                                select
                                label="Number of People"
                                name="numberOfPeople"
                                value={formData.numberOfPeople}
                                onChange={handleInputChange}
                                fullWidth
                                error={!!errors.numberOfPeople}
                                helperText={errors.numberOfPeople}
                                required
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                                    <MenuItem key={num} value={num.toString()}>
                                        {num}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </div>

                        <div className="mb-4">
                            <FormControl fullWidth error={!!errors.reservationDate}>
                                <DatePicker
                                    label="Reservation Date"
                                    value={formData.reservationDate}
                                    onChange={handleDateChange}
                                    disablePast
                                    shouldDisableDate={(date) => isMonday(date)}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            required: true,
                                            error: !!errors.reservationDate,
                                        },
                                    }}
                                />
                                {errors.reservationDate && <FormHelperText>{errors.reservationDate}</FormHelperText>}
                            </FormControl>
                        </div>

                        <div className="mb-4">
                            <FormControl fullWidth error={!!errors.reservationTime}>
                                <TimePicker
                                    label="Reservation Time"
                                    value={formData.reservationTime}
                                    onChange={handleTimeChange}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            required: true,
                                            error: !!errors.reservationTime,
                                        },
                                    }}
                                />
                                {errors.reservationTime && <FormHelperText>{errors.reservationTime}</FormHelperText>}
                                {!errors.reservationTime && (
                                    <FormHelperText>Available times: 11:00 AM - 2:30 PM and 5:00 PM - 9:00 PM</FormHelperText>
                                )}
                            </FormControl>
                        </div>

                    </div>
                </DialogContent>
                <DialogActions className="p-4">
                    <Button onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary" disabled={submitting}>
                        {submitting ? <CircularProgress size={24} /> : "Update Reservation"}
                    </Button>
                </DialogActions>
            </Dialog>
        </LocalizationProvider>
    )
}
