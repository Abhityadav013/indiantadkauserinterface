"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
    TextField,
    Button,
    MenuItem,
    FormControl,
    FormHelperText,
    CircularProgress,
    Box,
} from "@mui/material"
import toast from 'react-hot-toast';
import { isValid, isMonday, format, parse, isWithinInterval } from "date-fns"
import { CountryCode, getCountryCallingCode } from 'libphonenumber-js';
import PhoneInput from "./PhoneInput"
import { DatePicker, LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Loader from "../CartLoader";

interface FormData {
    fullName: string
    phoneNumber: string
    numberOfPeople: string
    reservationDate: Date | null
    reservationTime: Date | null
}

interface FormErrors {
    fullName?: string
    phoneNumber?: string
    numberOfPeople?: string
    reservationDate?: string
    reservationTime?: string
}

interface DisabledDateResponse {
    success: boolean
    dates: string[]
    message?: string
}

export default function ReservationForm() {
    const [formData, setFormData] = useState<FormData>({
        fullName: "",
        phoneNumber: "",
        numberOfPeople: "2",
        reservationDate: null,
        reservationTime: null,
    })
    const [selectedCountry] = useState<CountryCode>("DE");
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [errors, setErrors] = useState<FormErrors>({})
    const [disabledDates, setDisabledDates] = useState<Date[]>([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        const fetchDisabledDates = async () => {
            try {
                const response = await fetch("/api/v1/reservation/disabled-dates")
                if (!response.ok) throw new Error("Failed to fetch disabled dates")

                const data: DisabledDateResponse = await response.json()

                if (!data.success) {
                    throw new Error(data.message || "Failed to fetch disabled dates")
                }

                const parsedDates: Date[] = data.dates.map((dateStr: string) => new Date(dateStr))
                setDisabledDates(parsedDates)
            } catch (error) {
                console.error("Error fetching disabled dates:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchDisabledDates()
    }, [])

    useEffect(() => {
        if (phoneNumber) {
            setFormData({ ...formData, ['phoneNumber']: phoneNumber })
        }
    }, [phoneNumber, formData])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })

        // Clear error when user types
        if (errors[name as keyof FormErrors]) {
            setErrors({ ...errors, [name]: undefined })
        }
    }

    const handleDateChange = (date: Date | null) => {
        setFormData({ ...formData, reservationDate: date })
        if (errors.reservationDate) {
            setErrors({ ...errors, reservationDate: undefined })
        }
    }

    const handleTimeChange = (time: Date | null) => {
        setFormData({ ...formData, reservationTime: time })
        if (errors.reservationTime) {
            setErrors({ ...errors, reservationTime: undefined })
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setSubmitting(true)

        try {
            // Combine date and time for the API
            let combinedDateTime = null
            if (formData.reservationDate && formData.reservationTime) {
                combinedDateTime = new Date(formData.reservationDate)
                combinedDateTime.setHours(formData.reservationTime.getHours(), formData.reservationTime.getMinutes())
            }
            const ssid = localStorage.getItem('ssid');
            const _device_id = ssid || '';
            const response = await fetch("/api/v1/reservation", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ssid: _device_id,
                },
                body: JSON.stringify({
                    ...formData,
                    phoneNumber: `+${getCountryCallingCode(selectedCountry)}${phoneNumber}`,
                    reservationDateTime: combinedDateTime,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || "Failed to submit reservation")
            }

            // Reset form on success
            setFormData({
                fullName: "",
                phoneNumber: "",
                numberOfPeople: "2",
                reservationDate: null,
                reservationTime: null,
            })

            setPhoneNumber("")
            toast.success(`Reservation submitted successfully! We look forward to seeing you.`, {
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
            console.error("Error submitting reservation:", error)
        } finally {
            setSubmitting(false)
        }
    }

    const isDateDisabled = (date: Date): boolean => {
        // Disable Mondays
        if (isMonday(date)) return true

        // Disable dates from the backend
        return disabledDates.some((disabledDate) => format(disabledDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd"))
    }
    //  message: "Reservation submitted successfully! We look forward to seeing you.",

    if (loading) {
        return (
            <Box
                sx={{
                    position: 'fixed',       // Overlay over the entire screen
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 9999,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: 'white',
                }}
            >
                <Loader
                    loadingImage={
                        'https://testing.indiantadka.eu/assets/reservationTable.gif'
                    }
                    isLoading={loading}
                />
            </Box>
        )
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <form
                onSubmit={handleSubmit}
                className="relative z-10 max-w-5xl mx-auto bg-white bg-opacity-80 backdrop-blur-md rounded-lg shadow-xl p-6 md:p-12"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                    <div className="space-y-6">
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

                    </div>

                    <div className="space-y-6">
                        <div className="mb-4">
                            <FormControl fullWidth error={!!errors.reservationDate}>
                                <DatePicker
                                    label="Reservation Date"
                                    value={formData.reservationDate}
                                    onChange={handleDateChange}
                                    disablePast
                                    shouldDisableDate={isDateDisabled}
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
                                    <FormHelperText className="mt-4">Available times: 11:00 AM - 2:30 PM and 5:00 PM - 9:00 PM</FormHelperText>
                                )}
                            </FormControl>
                        </div>
                        <div className="pt-2">
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                size="large"
                                disabled={submitting}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                {submitting ? <CircularProgress size={24} /> : "Submit Reservation"}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </LocalizationProvider>
    )
}
