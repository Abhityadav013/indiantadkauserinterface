import CartWrapper from '@/components/CartWrapper'
import FooterCopyRights from '@/components/FooterCopyRight'
import NavBarNavigation from '@/components/NavBarNavigation'
import { Box } from '@mui/material'
import React from 'react'

const page = async () => {

  return (
    <Box
      component="section"
      sx={{
        overflow: 'auto',
        backgroundColor: '#e9ecee',
        padding: 2,
        height: '100vh',
        // maxHeight:'110vh'
      }}
    >
      <NavBarNavigation label="Your Cart" isImage={true} />
      <CartWrapper />
      <FooterCopyRights />
    </Box>
  )
}

export default page
