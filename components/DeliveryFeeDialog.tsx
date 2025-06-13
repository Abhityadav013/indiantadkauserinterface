import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface DeliveryFeeDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function DeliveryFeeDialog({ open, onClose }: DeliveryFeeDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography component="div">Delivery fee</Typography>
        <IconButton edge="end" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Typography variant="body2" gutterBottom>
          This contributes to the costs of delivery to you. It can vary depending on e.g. your distance from the store, selected store, order value and, sometimes, time of day.
        </Typography>

        <Typography variant="subtitle2" sx={{ mt: 2 }}>
          <strong>Minimum order value for this place is 10,00 €</strong>
        </Typography>

        <TableContainer component={Paper} sx={{ mt: 2, boxShadow: 'none' }}>
          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell><strong>Order value*</strong></TableCell>
                <TableCell><strong>Delivery</strong></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>10,00 € – 65,00 €</TableCell>
                <TableCell>1,50 €</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Over 65,00 €</TableCell>
                <TableCell>Free</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
          Excluding offers, service fees and delivery fees.
        </Typography>
      </DialogContent>
    </Dialog>
  );
}
