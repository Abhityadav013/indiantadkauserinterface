'use client';
import { ValidationError, ValidationErrorResponse } from '@/lib/types/api_response';
import { CustomerOrder } from '@/lib/types/customer_order_type';
import { ErrorResponse } from '@/lib/types/error_type';
import { useUpdateCustomerDetailsMutation } from '@/store/api/customerDetailsApi';
import {
  closeAddressModel,
  fetchCustomerDetailsFailure,
  fetchCustomerDetailsStart,
  fetchCustomerDetailsSuccess,
  openAddressModel,
  setCustomerOrderState,
} from '@/store/slices/addressSlice';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

export function useUpdateAddressDetails() {
  const [formError, setFormError] = useState<ErrorResponse>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [updateCustomerDetails] = useUpdateCustomerDetailsMutation();
  const dispatch = useDispatch();

  const handleAdddressDetailOpen = () => {
    dispatch(openAddressModel());
  };
  const handleAdddressDetailClose = () => {
    dispatch(closeAddressModel());
  };

  const handleUpdateCustomerDetails = async (customerDetails: CustomerOrder) => {
    try {
      // Update customer details using RTK Query mutation
      setLoading(true);
      dispatch(fetchCustomerDetailsStart());
      const response = await updateCustomerDetails(customerDetails).unwrap();
      dispatch(setCustomerOrderState(response.data));
      dispatch(fetchCustomerDetailsSuccess(response.data.customerDetails));
      dispatch(closeAddressModel());
      setLoading(false);
    } catch (error) {
      // Check if the error is validation-related
      if (error instanceof Error && error.message === 'Validation Failed') {
        // If validation failed, we should extract and show the validation errors
        const validationErrors: ValidationError[] =
          (error as unknown as ValidationErrorResponse).data || [];
        setFormError(validationErrors.map((e) => ({ key: e.key, message: e.message })));
        dispatch(
          fetchCustomerDetailsFailure(
            validationErrors.map((e) => ({ key: e.key, message: e.message }))
          )
        );
      } else {
        setFormError([
          { key: 'unknown', message: 'An error occurred while updating the customer details.' },
        ]);
      }
    }
  };

  return {
    loading,
    formError,
    setFormError,
    handleUpdateCustomerDetails,
    handleAdddressDetailOpen,
    handleAdddressDetailClose,
  };
}
