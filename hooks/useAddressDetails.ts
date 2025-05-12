'use client';
import { ValidationError, ValidationErrorResponse } from '@/lib/types/api_response';
import { CustomerDetails, CustomerOrder } from '@/lib/types/customer_order_type';
import { ErrorResponse } from '@/lib/types/error_type';
import {
  useFetchCustomerDetailsQuery,
  useUpdateCustomerDetailsMutation,
} from '@/store/api/customerDetailsApi';
import { useEffect, useState } from 'react';

export function useAddressDetails() {
  const [isAddressModelOpen, setAddressModelOpen] = useState<boolean>(false);
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>();
  const [customerOrder, setCustomerOrder] = useState<CustomerOrder>();
  const [formError, setFormError] = useState<ErrorResponse>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { data: fetchedCustomerOrder, isLoading } = useFetchCustomerDetailsQuery();
  const [updateCustomerDetails] = useUpdateCustomerDetailsMutation();

  useEffect(() => {
   
    if (!isLoading) {
      setCustomerDetails(fetchedCustomerOrder?.customerDetails);
      setCustomerOrder(fetchedCustomerOrder);
    }
  }, [isLoading, fetchedCustomerOrder]);

  const handleAdddressDetailOpen = (value: boolean) => {
    setAddressModelOpen(value);
  };

  const handleAdddressDetailClose = () => {
    setAddressModelOpen(false);
  };

  const handleUpdateCustomerDetails = async (customerDetails: CustomerOrder) => {
    try {
      // Update customer details using RTK Query mutation
      setLoading(true);
      const response = await updateCustomerDetails(customerDetails).unwrap();
      setCustomerOrder(response.data);
      setCustomerDetails(response.data.customerDetails);
      handleAdddressDetailClose(); // Close the model after success
      setLoading(false);
    } catch (error) {
      // Check if the error is validation-related
      if (error instanceof Error && error.message === 'Validation Failed') {
        // If validation failed, we should extract and show the validation errors
        const validationErrors: ValidationError[] =
          (error as unknown as ValidationErrorResponse).data || [];
        setFormError(validationErrors.map((e) => ({ key: e.key, message: e.message })));
      } else {
        setFormError([
          { key: 'unknown', message: 'An error occurred while updating the customer details.' },
        ]);
      }
    }
  };

  const getCustomerOrderDetail = async () => {
    if (!isLoading) {
      setCustomerDetails(fetchedCustomerOrder?.customerDetails);
      setCustomerOrder(fetchedCustomerOrder);
    }
  };

  return {
    loading,
    formError,
    customerDetails,
    customerOrder,
    isAddressModelOpen,
    getCustomerOrderDetail,
    setFormError,
    handleAdddressDetailOpen,
    handleAdddressDetailClose,
    handleUpdateCustomerDetails,
  };
}
