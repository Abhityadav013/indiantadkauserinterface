"use client"

import { Button, Typography, Divider } from "@mui/material"
import { useCart } from "@/hooks/useCartDetails"

export default function CartPanel() {
  const { items:cartItems } = useCart()

  if (cartItems.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
        <Typography variant="h6" className="font-bold mb-4">
          Your Cart
        </Typography>
        <div className="py-8 text-center">
          <Typography variant="body1" color="text.secondary">
            Your cart is empty
          </Typography>
          <Typography variant="body2" color="text.secondary" className="mt-2">
            Add items to get started
          </Typography>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-6 border border-gray-100">
      <Typography variant="h6" className="font-bold mb-4">
        Your Cart
      </Typography>

      <div className="space-y-4 mb-6 max-h-[50vh] overflow-y-auto">
        {cartItems.map((item) => (
          <div key={item.itemId} className="flex justify-between">
            <div className="flex-1">
              <div className="flex justify-between">
                <Typography variant="body1" className="font-medium">
                  {item.itemName}
                </Typography>
                <Typography variant="body1" className="ml-2">
                  {/* ${(item.price * item.quantity).toFixed(2)} */}
                </Typography>
              </div>
              <div className="flex items-center mt-1">
                {/* <IconButton size="small" onClick={() => removeFromCart(item)} className="border border-gray-300">
                  <Remove fontSize="small" />
                </IconButton>
                <Typography className="mx-2">{item.quantity}</Typography>
                <IconButton size="small" onClick={() => addToCart(item)} className="border border-gray-300">
                  <Add fontSize="small" />
                </IconButton> */}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Divider className="my-4" />

      <div className="flex justify-between mb-6">
        <Typography variant="h6">Total</Typography>
        <Typography variant="h6" className="font-bold">
          {/* ${totalAmount.toFixed(2)} */}
        </Typography>
      </div>

      <Button
        variant="contained"
        color="primary"
        fullWidth
        size="large"
        className="bg-primary hover:bg-primary-dark btn-primary"
      >
        Checkout
      </Button>
    </div>
  )
}
