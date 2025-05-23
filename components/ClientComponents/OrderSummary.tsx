"use client"

import { Paper, Typography, Divider, List, ListItem, Box, Button } from "@mui/material"
import { LocalDining } from "@mui/icons-material"

// Mock data for cart items
const cartItems = [
  { id: 1, name: "Margherita Pizza", quantity: 1, price: 8.99, options: ["Extra Cheese"] },
  { id: 2, name: "Garlic Bread", quantity: 2, price: 3.49, options: [] },
  { id: 3, name: "Caesar Salad", quantity: 1, price: 5.99, options: ["No Croutons"] },
  { id: 4, name: "Coca Cola", quantity: 2, price: 1.99, options: [] },
]

// Calculate totals
const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
const deliveryFee = 2.99
const serviceFee = 0.99
const total = subtotal + deliveryFee + serviceFee

export default function OrderSummary() {
  return (
    <Paper className="p-5 border border-gray-200 rounded-lg shadow-sm">
      <Box className="flex items-center mb-4">
        <LocalDining className="mr-2 text-orange-500" />
        <Typography variant="h6" className="font-bold">
          Your order
        </Typography>
      </Box>

      <Typography variant="subtitle2" className="text-gray-600 mb-4">
        From: Bella Italia
      </Typography>

      <List className="mb-4">
        {cartItems.map((item) => (
          <ListItem key={item.id} className="flex flex-col items-start py-2 px-0">
            <Box className="flex justify-between w-full">
              <Typography variant="body1" className="font-medium">
                {item.quantity}x {item.name}
              </Typography>
              <Typography variant="body1" className="font-medium">
                €{(item.price * item.quantity).toFixed(2)}
              </Typography>
            </Box>
            {item.options.length > 0 && (
              <Typography variant="body2" className="text-gray-500 mt-1">
                {item.options.join(", ")}
              </Typography>
            )}
          </ListItem>
        ))}
      </List>

      <Divider className="mb-4" />

      <Box className="space-y-2 mb-4">
        <Box className="flex justify-between">
          <Typography variant="body2">Subtotal</Typography>
          <Typography variant="body2">€{subtotal.toFixed(2)}</Typography>
        </Box>
        <Box className="flex justify-between">
          <Typography variant="body2">Delivery Fee</Typography>
          <Typography variant="body2">€{deliveryFee.toFixed(2)}</Typography>
        </Box>
        <Box className="flex justify-between">
          <Typography variant="body2">Service Fee</Typography>
          <Typography variant="body2">€{serviceFee.toFixed(2)}</Typography>
        </Box>
      </Box>

      <Divider className="mb-4" />

      <Box className="flex justify-between mb-6">
        <Typography variant="h6" className="font-bold">
          Total
        </Typography>
        <Typography variant="h6" className="font-bold">
          €{total.toFixed(2)}
        </Typography>
      </Box>

      <Button variant="outlined" fullWidth className="border-orange-500 text-orange-500 hover:bg-orange-50">
        Add More Items
      </Button>
    </Paper>
  )
}
