import React from 'react'
import { Button } from "@mui/material";

interface AddAddressButtonProps {
    textToDisplay: string,
    handleAdddressDetailOpen: (value:boolean) => void
}

const AddAddressButton: React.FC<AddAddressButtonProps> = ({ textToDisplay, handleAdddressDetailOpen }) => {

    return (
        <Button
            variant="contained"
            fullWidth
            sx={{
                bottom: '6px',
                backgroundColor: '#059669', // Tailwind emerald.600 doesn't directly map to MUI, so use custom or hex
                borderRight: 0,
                color: 'white',
                borderRadius: 0,
                '&:hover': {
                    backgroundColor: '#059669', // Tailwind's emerald-600 hover equivalent
                },
            }}
            onClick={() =>handleAdddressDetailOpen(true)}
        >
            {textToDisplay}
        </Button>

    )
}

export default AddAddressButton
