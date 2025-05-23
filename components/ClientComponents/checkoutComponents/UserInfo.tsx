import React, { useEffect, useState } from 'react'
import Person4OutlinedIcon from '@mui/icons-material/Person4Outlined';
import { DialogType } from '@/lib/types/dialog_type';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { OrderDetailsSummary } from '@/lib/types/order_details_type';

interface UserInfoProps {
    openDialog: DialogType,
    customerDetails: {
        name: string
        phoneNumber: string
    },
    handleOpen: (dialog: DialogType) => void,
    handleClose: () => void,
    handleDialogAction: <T extends Exclude<DialogType, null>>(data: OrderDetailsSummary<T>) => void
}
const UserInfo = ({ openDialog, customerDetails, handleOpen, handleClose, handleDialogAction }: UserInfoProps) => {
    const [name, setName] = useState<string>(customerDetails.name);
    const [phoneNumber, setPhoneNumber] = useState<string>(customerDetails.phoneNumber)
    useEffect(() => {
        if (customerDetails) {
            setName(customerDetails.name)
            setPhoneNumber(customerDetails.phoneNumber)
        }
    }, [customerDetails])

    const handleUserInfoSave = () => {
        handleDialogAction({
            type: "contact",
            payload: {
                name: name,
                phoneNumber: phoneNumber
            }
        });
    }
    return (
        <>
            <div className="flex items-center justify-between p-3 bg-white hover:bg-gray-100 rounded cursor-pointer" onClick={() => handleOpen('contact')}>
                <div className="flex items-center gap-2">
                    <Person4OutlinedIcon className="text-orange-500" />
                    <div>
                        <p className="font-medium">{customerDetails.name}</p>
                        <p className="text-sm text-gray-600">{customerDetails.phoneNumber}</p>
                    </div>
                </div>
                <span ><ArrowForwardIosOutlinedIcon className="text-gray-400" /></span>
            </div>

            <Dialog open={openDialog === 'contact'} onClose={handleClose} maxWidth={"lg"}>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography component="div" variant='h5' fontWeight="bold">
                        <Person4OutlinedIcon className="text-black mr-5" />
                        Your details</Typography>
                    <IconButton edge="end" onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <div className="w-[420px] p-6 relative">
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                First Name
                            </label>
                            <TextField
                                id="name"
                                placeholder="Enter your first name"
                                variant="outlined"
                                onChange={(e) => setName(e.target.value)}
                                fullWidth
                                value={name}
                                required
                                InputProps={{
                                    sx: {
                                        borderRadius: '15px',
                                    },
                                }}
                            />
                        </div>
                        <div>
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number
                            </label>
                            <TextField
                                id="phoneNumber"
                                placeholder="Enter your phone number"
                                variant="outlined"
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                fullWidth
                                value={phoneNumber}
                                required
                                InputProps={{
                                    sx: {
                                        borderRadius: '15px',
                                    },
                                }}
                            />
                        </div>
                    </div>

                </DialogContent>

                <DialogActions sx={{ justifyContent: 'center' }}>
                    <Button
                        variant="contained"
                        onClick={handleUserInfoSave}
                        sx={{
                            width: '80%',  // Button will fill the available width of the container
                            backgroundColor: '#f36805', // Orange background
                            color: 'white', // White text
                            padding: '6px 24px', // 6px top/bottom, 24px left/right
                            fontSize: '20px', // Font size for the button text
                            fontWeight: 'bold', // Make the text bold
                            borderRadius: '50px', // Rounded corners for a more curved button
                            textTransform: 'none', // Prevent text from becoming uppercase
                            '&:hover': {
                                backgroundColor: '#f36805', // Darker orange on hover
                            },
                        }}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </>

    )
}

export default UserInfo
