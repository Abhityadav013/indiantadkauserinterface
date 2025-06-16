'use client'
import React from 'react'
import {
    Receipt,
} from "@mui/icons-material";
import { Button } from '@mui/material';
const SaveOrderRecipet = () => {
    const handlePrintReceipt = () => {
        window.print()
    }
    return (
        <Button variant="contained" startIcon={<Receipt />} onClick={() => handlePrintReceipt()}>
            Print Receipt
        </Button>

    )
}

export default SaveOrderRecipet
