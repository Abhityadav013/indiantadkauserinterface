import React from 'react'
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';
import { DialogType } from '@/lib/types/dialog_type';
import ControlPointOutlinedIcon from '@mui/icons-material/ControlPointOutlined';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { OrderDetailsSummary } from '@/lib/types/order_details_type';
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';
interface DeliveryNoteProps {
    openDialog: DialogType,
    deliveryNote: {
        notes: string
    },
    handleOpen: (dialog: DialogType) => void,
    handleClose: () => void,
    handleDialogAction: <T extends Exclude<DialogType, null>>(data: OrderDetailsSummary<T>) => void
}
const DeliveryNote = ({ openDialog, deliveryNote, handleOpen, handleClose, handleDialogAction }: DeliveryNoteProps) => {
    const [note, setNote] = React.useState<string>('');
    const maxChars = 160;

    React.useEffect(() => {
        if (deliveryNote) {
            setNote(deliveryNote.notes)
        }
    }, [deliveryNote])

    const handleDeliveryNoteInfoSave = () => {
        handleDialogAction({
            type: "notes",
            payload: {
                notes: note
            }
        });
    }

    const handleDeletNote = () => {
        setNote('')
        handleDialogAction({
            type: "notes",
            payload: {
                notes: ''
            }
        });
    }

    return (
        <>
            <div className="flex items-center justify-between p-3 bg-white hover:bg-gray-100  rounded cursor-pointer" onClick={() => handleOpen('notes')}>
                <div className="flex items-center gap-2">
                    {
                        note ? <div className="flex items-start gap-2 w-full">
                            <TextSnippetOutlinedIcon className="text-orange-500 mt-1 shrink-0" />
                            <p className="font-medium text-sm sm:text-base break-words whitespace-pre-line max-w-[300px]">
                                {note}
                            </p>
                        </div>
                            : <>
                                <NoteAddOutlinedIcon className="text-orange-500" />
                                <p className="font-medium">Add delivery notes</p>
                            </>
                    }



                </div>
                <span ><ControlPointOutlinedIcon className='text-gray-400' /></span>
            </div>

            <Dialog open={openDialog === 'notes'} onClose={handleClose} maxWidth={"lg"}>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography component="div" variant='h5' fontWeight="bold">
                        <NoteAddOutlinedIcon className="text-black mr-5" />
                        Delivery notes</Typography>
                    <IconButton edge="end" onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <div className="w-[620px] p-6 relative">
                        <Typography variant='h6' fontWeight={"bold"} >Leave a note for the courier. Please don&apos;t add allergy info here. This note is not visible to the seller.</Typography>
                        <Box sx={{ width: '100%', mt: 3 }}>
                            {/* Word count on top right */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                <Typography variant="subtitle2" color="textSecondary">
                                    <b>Add your note</b> <span style={{ fontWeight: 400 }}>(Optional)</span>
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                    {note.length}/{maxChars}
                                </Typography>
                            </Box>

                            <TextField
                                multiline
                                fullWidth
                                rows={4}
                                placeholder={`For example: "Leave at the doorstep, no need to ring the bell"`}
                                value={note}
                                onChange={(e) => {
                                    if (e.target.value.length <= maxChars) {
                                        setNote(e.target.value);
                                    }
                                }}
                                inputProps={{
                                    maxLength: maxChars,
                                }}
                                sx={{
                                    '& .MuiInputBase-root': {
                                        borderRadius: '15px',
                                    },
                                }}
                            />
                        </Box>
                    </div>

                </DialogContent>

                <DialogActions
                    sx={{
                        flexDirection: 'column',
                        alignItems: 'stretch',
                        gap: 2, // spacing between buttons
                        px: 4,
                        pb: 3,
                    }}
                >
                    <Button
                        variant="contained"
                        onClick={handleDeliveryNoteInfoSave}
                        sx={{
                            backgroundColor: '#f36805',
                            color: 'white',
                            padding: '6px 24px',
                            fontSize: '18px',
                            fontWeight: 'bold',
                            borderRadius: '50px',
                            textTransform: 'none',
                            '&:hover': {
                                backgroundColor: '#f36805',
                            },
                        }}
                    >
                        Save
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={handleDeletNote}
                        sx={{
                            padding: '6px 24px',
                            fontSize: '18px',
                            fontWeight: 'bold',
                            borderRadius: '50px',
                            textTransform: 'none',
                        }}
                    >
                        Delete
                    </Button>
                </DialogActions>

            </Dialog>
        </>
    )
}

export default DeliveryNote
