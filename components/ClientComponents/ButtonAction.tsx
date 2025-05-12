import React from 'react'
import { Button } from "@mui/material";

interface ButtonActionProps {
    textToDisplay: string,
    handleButtonAction: (value:boolean) => void
    btnColor?:string
}

const ButtonAction: React.FC<ButtonActionProps> = ({ textToDisplay,btnColor, handleButtonAction}) => {
    return (
        <Button
            variant="contained"
            fullWidth
            sx={{
                bottom: '6px',
                backgroundColor:btnColor ? btnColor: '#059669', // Tailwind emerald.600 doesn't directly map to MUI, so use custom or hex
                borderRight: 0,
                color: 'white',
                borderRadius: 0,
                '&:hover': {
                    backgroundColor:btnColor? btnColor: '#059669', // Tailwind's emerald-600 hover equivalent
                },
            }}
            onClick={() =>handleButtonAction(true)}
        >
            {textToDisplay}
        </Button>

    )
}

export default ButtonAction
