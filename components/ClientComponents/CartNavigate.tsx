'use client'
import React from 'react'
import { Button } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useRouter } from 'next/navigation'


const CartNavigate = () => {
  const router = useRouter(); // Initialize router

  const handleNavigate = () => {
    // ToDo:: Need this when we have Login functioanlity
    router.push("/cart"); // Navigate to cart page
    //router.push('order-details')
  };
  return (
    <Button
      variant="contained"
      className="!bg-white !text-green-600 hover:!bg-gray-100"
      startIcon={<ShoppingCartIcon />}
      onClick={handleNavigate} // Handle navigation
    >
      View Basket
    </Button>
  )
}

export default CartNavigate
