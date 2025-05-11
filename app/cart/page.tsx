import CartWrapper from '@/components/CartWrapper'
import NavBarNavigation from '@/components/NavBarNavigation'
import { Box } from '@mui/material'
import React from 'react'

const page = async() => {

  return (
    <Box
      component="section"
      sx={{
        marginBottom: '1rem',
        overflow: 'auto',
        backgroundColor: '#e9ecee',
        padding: 2,
        height:'100vh'
      }}
    >
       <NavBarNavigation label="Your Cart" isImage={true} />
       <CartWrapper />
    </Box>
  )
}

export default page
