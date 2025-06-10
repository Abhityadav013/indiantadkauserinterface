'use client'
import React, { useState } from 'react'
import { TextField, Button, Box, CircularProgress } from "@mui/material";
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';
const ContactUsForm = () => {
    const t = useTranslations("contact_us")
    const [message, setMessage] = useState("");
    const [name, setName] = useState("");
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const ssid = localStorage.getItem('ssid');
            const _device_id = ssid || '';
            const response = await fetch("/api/v1/contact-us", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    ssid: _device_id,
                },
                body: JSON.stringify({ name, message }),
            });
            if (response.ok) {
                toast.success(`${t('toast_message')} 📩`, {
                    duration: 2000, // Show toast for 2 seconds
                    style: {
                        padding: "16px 24px", // Adjusted padding
                        height: "80px", // Fixed height
                        fontSize: "16px", // Fixed font size
                        backgroundColor: "#28a745", // Green color for success
                        color: "#fff", // White text
                        borderRadius: "10px",
                    },
                    iconTheme: {
                        primary: "#fff", // White icon
                        secondary: "#28a745", // Green icon
                    },
                });
                setMessage("");
                setName("");
            } else {
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong. Please try again.");
        } finally {
            setSubmitting(false)
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Box sx={{ marginBottom: "16px" }}>
                <TextField
                    fullWidth
                    label={t('field_one')}
                    variant="outlined"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </Box>
            <Box sx={{ marginBottom: "16px" }}>
                <TextField
                    fullWidth
                    label={t('field_two')}
                    variant="outlined"
                    multiline
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
            </Box>
            <Button
                type="submit"
                variant="contained"
                className="w-full !bg-orange-600 text-white py-2"
                disabled={submitting}
            >
                {submitting ? <CircularProgress size={24} /> : t('button')}
            </Button>
        </form>
    )
}

export default ContactUsForm
