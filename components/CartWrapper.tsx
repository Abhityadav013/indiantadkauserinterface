import { Box } from '@mui/material'
import React from 'react'
import CartHistory from './ClientComponents/CartHistory'
import SuggestionInput from './ClientComponents/RestroSuggestion'
import BillDetails from './BillDetails'
import CustomerContactDetails from './ClientComponents/CustomerContactDetails'
import ProceedCheckout from './ProceedCheckout'

const CartWrapper = () => {
    return (
        <Box
            sx={{
                maxWidth: '100%',
                mx: 'auto',
                display: { xs: 'block', md: 'flex' }, // 'block' on mobile, 'flex' on md and up
                gap: { xs: 0, md: 4 },
                backgroundColor: '#e9ecee',
                mt: { xs: 8, sm: 8, md: 6 }, // 12 margin-top on mobile, 7 on md and up
            }}
        >

            <Box sx={{ width: { sm: '40%', lg: '50%' } }}>
                <CartHistory />
                {/* <CustomerContactDetails /> */}
                {/* <AddAddressSection isMobile={isMobile} /> */}
            </Box>
            <Box sx={{ width: { sm: '40%', lg: '50%' }, mt: 2, mb: 4, '& > *': { mb: 2 } }}>
                <SuggestionInput />
                <BillDetails />
                <CustomerContactDetails />
                <ProceedCheckout/>
            </Box>
            
        </Box>
    )
}

export default CartWrapper
