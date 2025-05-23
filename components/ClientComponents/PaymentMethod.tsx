"use client"

import type React from "react"

import { useState } from "react"
import {
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Divider,
  Paper,
} from "@mui/material"
import { ExpandMore, CreditCard, Apple, Google, Payment, Money, AccountBalance } from "@mui/icons-material"

export default function PaymentMethod() {
  const [paymentMethod, setPaymentMethod] = useState<string>("")
  const [expanded, setExpanded] = useState<boolean>(true)
  const [voucherExpanded, setVoucherExpanded] = useState<boolean>(false)
  const [voucherCode, setVoucherCode] = useState<string>("")

  const handlePaymentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(event.target.value)
  }

  const handleAccordionChange = () => {
    setExpanded(!expanded)
  }

  const handleVoucherAccordionChange = () => {
    setVoucherExpanded(!voucherExpanded)
  }

  return (
    <>
      <Paper className="mb-4 overflow-hidden">
        <Accordion expanded={expanded} onChange={handleAccordionChange} disableGutters>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="payment-method-content"
            id="payment-method-header"
            className="px-6 py-3 bg-gray-50"
          >
            <Box className="flex flex-col">
              <Typography variant="subtitle1" className="font-bold">
                Select payment method
              </Typography>
              <Typography variant="caption" color="error">
                Required
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails className="px-6 py-4">
            <RadioGroup
              aria-label="payment method"
              name="payment-method"
              value={paymentMethod}
              onChange={handlePaymentChange}
            >
              <FormControlLabel
                value="apple-pay"
                control={<Radio />}
                label={
                  <Box className="flex items-center">
                    <Apple className="mr-2" />
                    <Typography>Apple Pay</Typography>
                  </Box>
                }
                className="mb-2 py-1"
              />
              <Divider />

              <FormControlLabel
                value="google-pay"
                control={<Radio />}
                label={
                  <Box className="flex items-center">
                    <Google className="mr-2" />
                    <Typography>Google Pay</Typography>
                  </Box>
                }
                className="mb-2 py-1 mt-2"
              />
              <Divider />

              <FormControlLabel
                value="credit-card"
                control={<Radio />}
                label={
                  <Box className="flex items-center">
                    <CreditCard className="mr-2" />
                    <Typography>Credit or debit card</Typography>
                  </Box>
                }
                className="mb-2 py-1 mt-2"
              />
              <Divider />

              <FormControlLabel
                value="paypal"
                control={<Radio />}
                label={
                  <Box className="flex items-center">
                    <Payment className="mr-2" />
                    <Typography>PayPal</Typography>
                  </Box>
                }
                className="mb-2 py-1 mt-2"
              />
              <Divider />

              <FormControlLabel
                value="amazon-pay"
                control={<Radio />}
                label={
                  <Box className="flex items-center">
                    <Payment className="mr-2" />
                    <Typography>Amazon Pay</Typography>
                  </Box>
                }
                className="mb-2 py-1 mt-2"
              />
              <Divider />

              <FormControlLabel
                value="cash"
                control={<Radio />}
                label={
                  <Box className="flex items-center">
                    <Money className="mr-2" />
                    <Typography>Cash</Typography>
                  </Box>
                }
                className="mb-2 py-1 mt-2"
              />
              <Divider />

              <FormControlLabel
                value="klarna"
                control={<Radio />}
                label={
                  <Box className="flex items-center">
                    <AccountBalance className="mr-2" />
                    <Typography>Klarna</Typography>
                  </Box>
                }
                className="py-1 mt-2"
              />
            </RadioGroup>
          </AccordionDetails>
        </Accordion>
      </Paper>

      <Paper className="mb-4 overflow-hidden">
        <Accordion expanded={voucherExpanded} onChange={handleVoucherAccordionChange} disableGutters>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="voucher-content"
            id="voucher-header"
            className="px-6 py-3 bg-gray-50"
          >
            <Typography variant="subtitle1" className="font-bold">
              Voucher
            </Typography>
          </AccordionSummary>
          <AccordionDetails className="px-6 py-4">
            <Box className="flex flex-col space-y-3">
              <Typography variant="body2" className="text-gray-600">
                Enter your voucher code here
              </Typography>
              <Box className="flex space-x-2">
                <TextField
                  variant="outlined"
                  size="small"
                  placeholder="Voucher code"
                  fullWidth
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                />
                <button
                  className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors whitespace-nowrap"
                  disabled={!voucherCode}
                >
                  Apply
                </button>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
      </Paper>
    </>
  )
}
