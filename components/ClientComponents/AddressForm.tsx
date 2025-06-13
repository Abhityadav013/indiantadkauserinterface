'use client'
import React from 'react';
import AddNewAddress, { AddressInput, UserInfo } from './AddAddress';
import { OrderType } from '@/lib/types/order_type';
import { CustomerDetails, CustomerOrder } from '@/lib/types/customer_order_type';
import { ErrorResponse } from '@/lib/types/error_type';

interface AddressFormProps {
    isAddressModelOpen: boolean
    customerOrder: CustomerOrder,
    customerDetails: CustomerDetails,
    formError: ErrorResponse,
    setFormError: React.Dispatch<React.SetStateAction<ErrorResponse>>,
    handleAdddressDetailClose: () => void,
    handleUpdateCustomerDetails: (value:CustomerOrder) => void,

}
const AddressForm: React.FC<AddressFormProps> = ({
    isAddressModelOpen,
    customerDetails,
    customerOrder,
    formError,
    setFormError,
    handleAdddressDetailClose,
    handleUpdateCustomerDetails
}) => {
    const onSubmit = async (values: { userInfo: UserInfo, orderType: OrderType, address?: AddressInput }) => {
        let userAddress = {
            displayAddress: '',
            buildingNumber: '',
            street: '',
            town: '',
            pincode: '',
            addressType: ''
        };

        if (values.address) {
            userAddress = {
                displayAddress: `${values.address?.street} ${values.address?.buildingNumber}, ${values.address?.pincode} ${values.address.town ?? ''}, Germany`,
                buildingNumber: values.address?.buildingNumber ?? '',
                street: values.address?.street ?? '',
                town: values.address?.town ?? '',
                pincode: values.address?.pincode ?? '',
                addressType: values.address?.addressType ?? ''
            };
        }

        const customerDetails: CustomerOrder = {
            customerDetails: {
                name: values.userInfo.name,
                phoneNumber: values.userInfo.phoneNumber,
                address: userAddress,
            },
            orderType: values.orderType,
        };
        console.log('customerDetails',customerDetails)
        await handleUpdateCustomerDetails(customerDetails)
    };

    return (
        <div>
            <AddNewAddress
                formValues={customerOrder ?? {} as CustomerOrder}
                onSubmit={onSubmit}
                isOpen={isAddressModelOpen} // Replace with actual model state
                onClose={() => handleAdddressDetailClose()}
                address={customerDetails?.address ?? { displayAddress: '', buildingNumber: '', street: '', town: '', pincode: '', addressType: '' }}
                error={formError}
                setFormError={setFormError}
            />
        </div>
    );
};

export default AddressForm;
