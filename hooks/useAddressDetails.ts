'use client';
import { CustomerDetails, CustomerOrder } from '@/lib/types/customer_order_type';
import { OrderType } from '@/lib/types/order_type';
import { useFetchCustomerDetailsQuery } from '@/store/api/customerDetailsApi';
import {
  fetchCustomerDetailsStart,
  fetchCustomerDetailsSuccess,
  setCustomerOrderState,
} from '@/store/slices/addressSlice';
import { setOrderType } from '@/store/slices/orderSlice';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

export function useAddressDetails() {
  const [isAddressModelOpen, setAddressModelOpen] = useState<boolean>(false);
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>();
  const [customerOrder, setCustomerOrder] = useState<CustomerOrder>();
  const { data: fetchedCustomerOrder, isLoading } = useFetchCustomerDetailsQuery();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isLoading) {
      sessionStorage.setItem(
        'notDeliverable',
        fetchedCustomerOrder?.customerDetails?.notDeliverable ? 'true' : 'false'
      );
      // If the data is not loading, we can set the customer details and order
      dispatch(fetchCustomerDetailsStart());
      setCustomerDetails(fetchedCustomerOrder?.customerDetails);
      setCustomerOrder(fetchedCustomerOrder);
      dispatch(setCustomerOrderState(fetchedCustomerOrder ?? ({} as CustomerOrder)));
      dispatch(
        fetchCustomerDetailsSuccess(
          fetchedCustomerOrder?.customerDetails ?? ({} as CustomerDetails)
        )
      );
      if (!sessionStorage.getItem('orderType')) {
        dispatch(setOrderType(fetchedCustomerOrder?.orderType ?? OrderType.DELIVERY));
        sessionStorage.setItem('orderType', fetchedCustomerOrder?.orderType ?? OrderType.DELIVERY);
      }
    }
  }, [isLoading, fetchedCustomerOrder, dispatch]);

  const handleAdddressDetailOpen = (value: boolean) => {
    setAddressModelOpen(value);
  };

  const handleAdddressDetailClose = () => {
    setAddressModelOpen(false);
  };

  const getCustomerOrderDetail = async () => {
    if (!isLoading) {
      setCustomerDetails(fetchedCustomerOrder?.customerDetails);
      setCustomerOrder(fetchedCustomerOrder);
    }
  };

  return {
    isLoading,
    customerDetails,
    customerOrder,
    isAddressModelOpen,
    getCustomerOrderDetail,
    handleAdddressDetailOpen,
    handleAdddressDetailClose,
    setAddressModelOpen,
  };
}
