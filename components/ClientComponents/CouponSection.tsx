'use client'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { AvailableCoupons } from '@/lib/types/availabelCoupons';
interface CouponSectionProps {
    selectedMethod: string,
    setCouponCode: React.Dispatch<React.SetStateAction<string>>,
    appliedCoupon: AvailableCoupons | null,
    handleCouponApply: () => void,
    handleCouponRemove: () => void
    couponCode: string,
    errorMessage: string,
    openCouponsDialog: () => void,
}

export default function CouponSection({
    selectedMethod,
    couponCode,
    setCouponCode,
    appliedCoupon,
    handleCouponApply,
    errorMessage,
    handleCouponRemove,
    openCouponsDialog,
}: CouponSectionProps) {
    const handleApply = () => {
        handleCouponApply();
    };

    return (
        selectedMethod !== 'cash' && (
            <div className="mt-6 space-y-4 animate-fade-in">
                {/* Input and Apply */}
                <div className="flex items-center gap-3 w-full">
                    <TextField
                        variant="outlined"
                        size="small"
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1 bg-white"
                        InputProps={{
                            style: {
                                fontSize: '0.875rem',
                                borderRadius: '8px',
                            },
                        }}
                    />
                    <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={handleApply}
                        className="normal-case font-medium rounded-md"
                    >
                        Apply
                    </Button>
                </div>

                {/* Applied Coupon Tag */}
                {appliedCoupon && (
                    <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded-md shadow-sm">
                        <CheckCircleIcon fontSize="small" />
                        <span className="text-sm font-medium">
                            {appliedCoupon.label} applied successfully!
                        </span>
                        <CancelIcon
                            fontSize="small"
                            className="text-red-500 cursor-pointer ml-auto"
                            onClick={handleCouponRemove}
                        />
                    </div>
                )}

                {/* Error message */}
                {errorMessage && (
                    <div className="flex items-start gap-2 px-3 py-2 bg-red-50 border border-red-300 text-red-700 rounded-md animate-fade-in">
                        <svg
                            className="w-5 h-5 mt-0.5 text-red-500"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
                            />
                        </svg>
                        <p className="text-sm">{errorMessage}</p>
                    </div>
                )}

                {/* Browse Coupons */}
                <div
                    onClick={openCouponsDialog}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-yellow-50 text-yellow-800 text-sm font-medium rounded-md cursor-pointer hover:bg-yellow-100 transition-colors w-fit"
                >
                    <LocalOfferIcon fontSize="small" />
                    Browse available coupons
                </div>
            </div>
        )
    );
}
