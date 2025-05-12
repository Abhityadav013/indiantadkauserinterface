import React from 'react'
import { Typography } from '@mui/material';
import HomeIcon from "@mui/icons-material/Home";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { OrderType } from '@/lib/types/order_type';
import { CustomerDetails, CustomerOrder } from '@/lib/types/customer_order_type';

interface CustomerContactDetailsWrapperProps {
    isLoading: boolean
    customerDetails: CustomerDetails,
    customerOrder: CustomerOrder
}

const CustomerContactDetailsWrapper: React.FC<CustomerContactDetailsWrapperProps> = ({ isLoading, customerDetails, customerOrder }) => {
    const formatPhoneNumber = (phone: string): string => {
        // Remove any non-digit characters like '+' or spaces
        const cleaned = phone.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{2})(\d+)$/); // e.g., '49' and the rest
        if (!match) return phone;
        return `+${match[1]} ${match[2]}`;
    }
    const isDeliveryOrder =
        (customerOrder && customerOrder.orderType === OrderType.DELIVERY) || false;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-20 space-x-2 mb-4">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
            </div>
        )
    }
    return (
        <React.Fragment>
            <Typography variant="body2" className="flex justify-between">
                Name <span className="text-black-600 font-bold">{customerDetails?.name ?? '..................'}</span>
            </Typography>
            <Typography variant="body2" className="flex justify-between">
                PhoneNumber <span className="text-black-600 font-bold">{formatPhoneNumber(customerDetails?.phoneNumber ?? '.....................')}</span>
            </Typography>
            {
                isDeliveryOrder && (
                    <div className="flex items-start gap-4">
                        {/* Icon block */}
                        <div className="relative w-12 h-12 mt-1 flex justify-center items-center border border-gray-300 rounded-lg">
                            <HomeIcon className="text-gray-700" fontSize="medium" />
                            <CheckCircleIcon className="absolute -top-2 -left-2 text-green-500 bg-white rounded-full" fontSize="small" />
                        </div>

                        {/* Address block */}
                        <div className="flex flex-col mt-2">
                            <Typography variant="body2" className="text-gray-900">
                                {`${customerDetails?.address?.street ?? '--'} ${customerDetails?.address?.buildingNumber ?? ''}`}

                            </Typography>
                            <Typography variant="body2" className="text-gray-600">
                                {`${customerDetails?.address?.pincode} Germany`}
                            </Typography>
                        </div>
                    </div>
                )
            }
        </React.Fragment>
    )
}

export default CustomerContactDetailsWrapper
