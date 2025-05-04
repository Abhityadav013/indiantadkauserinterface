'use client'
import React, { useState } from 'react'
import { TextField, Button, Box } from "@mui/material";
import toast from 'react-hot-toast';
const ContactUsForm = () => {

    const [message, setMessage] = useState("");
    const [name, setName] = useState("");
    // const isMobile = useSelector((state: RootState) => state.mobile.isMobile);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {

            const tid = localStorage.getItem('tid'); // Retrieve tid from session storage
            const ssid = localStorage.getItem('ssid');
            const response = await fetch("/api/contact-us", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Session-Id': ssid || '', // Add session ID to request headers
                    Tid: tid || '', // Add tid to request headers
                },
                body: JSON.stringify({ name, message }),
            });
            if (response.ok) {
                toast.success("Message sent successfully! 📩", {
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
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Box sx={{ marginBottom: "16px" }}>
                <TextField
                    fullWidth
                    label="Your Name"
                    variant="outlined"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </Box>
            <Box sx={{ marginBottom: "16px" }}>
                <TextField
                    fullWidth
                    label="Your Message"
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
                className="w-full bg-tomato text-white py-2"
            >
                Send Message
            </Button>
        </form>
    )
}

export default ContactUsForm
