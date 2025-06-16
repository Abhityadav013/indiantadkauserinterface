'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Divider } from '@mui/material';
import UserInfo from './checkoutComponents/UserInfo';
import { getCountryCallingCode } from 'libphonenumber-js';
import { OrderDetailsSummary } from '@/lib/types/order_details_type';
import { DialogType } from '@/lib/types/dialog_type';
import { dialogHandlers, getDialogDataFromSession } from '@/lib/updateCustomerOrderDetails';
import AddressInfo from './checkoutComponents/AddressInfo';
// import { UserAddress } from '@/lib/types/address_type';
import DeliveryTime from './checkoutComponents/DeliveryTime';
import DeliveryNote from './checkoutComponents/DeliveryNote';
import OrderDetailsSkeleton from '../Skeletons/OrderDetailsSkeleton';
import { OrderType } from '@/lib/types/order_type';
import { getIndianTadkaAddress } from '@/utils/getRestroAddress';
import { RootState } from '@/store';
import { useSelector } from 'react-redux';
import { CustomerDetails, CustomerOrder } from '@/lib/types/customer_order_type';
import { useAddressDetails } from '@/hooks/useAddressDetails';
import { useSearchParams } from 'next/navigation';
import { useUpdateAddressDetails } from '@/hooks/useUpdateAddressDetails';
// import { useSearchParams } from 'next/navigation';

interface OrderDetailsProps {
  userData: CustomerOrder
}

export default function OrderDetails({ userData }: OrderDetailsProps) {
  const [openDialog, setOpenDialog] = useState<null | 'contact' | 'address' | 'time' | 'notes'>(null);
  const searchParams = useSearchParams(); // URLSearchParams
  const orderParam = searchParams.get('orderType') || '';
  const handleOpen = (dialog: typeof openDialog) => setOpenDialog(dialog);
  const handleClose = () => setOpenDialog(null);
  const [userInfo, setUserInfo] = useState<{ name: string, phoneNumber: string }>({ name: userData.customerDetails?.name ?? '', phoneNumber: `+49-${userData.customerDetails?.phoneNumber}` });
  const [addressInfo, setAddressInfo] = useState<{ pincode: string, buildingNumber: string, street: string, town: string }>({
    pincode: userData.customerDetails?.address?.pincode ?? '',
    buildingNumber: userData.customerDetails?.address?.buildingNumber ?? '',
    street: userData.customerDetails?.address?.street ?? '',
    town: userData.customerDetails?.address?.town ?? ''
  })
  const [timeInfo, setTimeInfo] = useState<{ asap: boolean; scheduledTime: string } | null>(null);
  const [deliveryNoteInfo, setDeliveryNoteInfo] = useState<{ notes: string }>({ notes: "" })
  const { isLoading: loading, customerDetails } = useAddressDetails();
  const { handleUpdateCustomerDetails } = useUpdateAddressDetails();
  const order_type = useSelector((state: RootState) => state.order.orderType);
  const hasInitialized = useRef(false);
  const createUserDetails = useCallback(async ({ type }: { type: string }) => {
    const displayAddress = `${addressInfo.street} ${addressInfo.buildingNumber}, ${addressInfo.pincode} ${addressInfo.town}, Germany`;

    const updatedCustomerDetails: CustomerDetails = {
      name: userInfo.name,
      phoneNumber: `+${getCountryCallingCode('DE')}${userInfo.phoneNumber.split('-')[1]}`,
      address: {
        ...addressInfo,
        displayAddress,
        addressType: customerDetails?.address?.addressType ?? "home"
      }
    };

    if (type === 'contact') {
      const contactData = getDialogDataFromSession('contact') as { name: string; phoneNumber: string };
      updatedCustomerDetails.name = contactData.name
      updatedCustomerDetails.phoneNumber = `+${getCountryCallingCode('DE')}${contactData.phoneNumber.split('-')[1]}`
    }
    if (type === 'address') {
      const addressData = getDialogDataFromSession('address') as {
        pincode: string;
        buildingNumber: string;
        street: string;
        town: string;
      }
      const displayAddress = `${addressData.street} ${addressData.buildingNumber}, ${addressData.pincode} ${addressData.town}, Germany`;
      const address = {
        pincode: addressData.pincode,
        buildingNumber: addressData.buildingNumber,
        street: addressData.street,
        town: addressData.town,
      }
      updatedCustomerDetails.address = {
        ...address,
        displayAddress,
        addressType: customerDetails?.address?.addressType ?? "home"
      }
    }

    // Determine what needs to be updated
    // const shouldUpdateUserInfo = hasUserInfoChanged();
    // const shouldUpdateAddress = hasAddressChanged();

    // if (!shouldUpdateUserInfo && !shouldUpdateAddress) {
    //   console.log("No changes detected. Skipping update.");
    //   return;
    // }

    const payload: CustomerOrder = {
      customerDetails: updatedCustomerDetails,
      orderType: orderParam as OrderType,
    };

    await handleUpdateCustomerDetails(payload);

    // if (shouldUpdateUserInfo || shouldUpdateAddress) {


    //   if (shouldUpdateUserInfo) {
    //     setOriginalUserInfo(userInfo);
    //   }
    //   if (shouldUpdateAddress) {
    //     setOriginalAddressInfo(addressInfo);
    //   }
    // }
  }, [orderParam, addressInfo, userInfo, customerDetails, handleUpdateCustomerDetails]);

  const handleDialogAction = useCallback(<T extends Exclude<DialogType, null>>(data: OrderDetailsSummary<T>): void => {
    const handler = dialogHandlers[data.type];
    const storedData = handler(data.payload); // Get the stored data after calling the handler
    setOpenDialog(null)
    // Conditionally update the state based on the dialog type
    if (data.type === 'contact') {
      // If 'contact' dialog, update user info
      const newData = storedData as { name: string; phoneNumber: string };
      const hasChanged = newData.name !== userInfo.name || newData.phoneNumber !== userInfo.phoneNumber;
      setUserInfo(newData);
      if (hasChanged) createUserDetails({type:'contact'}); // ✅ Update only if changed
    } else if (data.type === 'address') {
      // If 'address' dialog, update address info
      const newData = storedData as { buildingNumber: string; street: string; pincode: string; town: string };
      const hasChanged =
        newData.pincode !== addressInfo.pincode ||
        newData.buildingNumber !== addressInfo.buildingNumber ||
        newData.street !== addressInfo.street ||
        newData.town !== addressInfo.town;
      setAddressInfo(newData);
      if (hasChanged) createUserDetails({ type: 'address'}); // ✅ Update only if changed
    } else if (data.type === 'time') {
      // If 'time' dialog, you can add logic for time
      // For example:
      setTimeInfo(storedData as { scheduledTime: string, asap: boolean });
    } else if (data.type === 'notes') {
      // If 'notes' dialog, handle notes info
      // For example:
      setDeliveryNoteInfo(storedData as { notes: string });
    }
  }, [])

  useEffect(() => {
    // Only run when loading is false
    if (!loading && customerDetails && !hasInitialized.current) {
      hasInitialized.current = true
      // Get data from session
      const contactData = getDialogDataFromSession('contact');
      const addressData = getDialogDataFromSession('address');
      const deliveryTimeData = getDialogDataFromSession('time');
      const deliverNoteData = getDialogDataFromSession("notes")
      // Use session if exists, else fallback to customerDetails
      if (contactData) {
        setUserInfo(contactData as { name: string; phoneNumber: string });
      } else if (customerDetails) {
        const fullNumber = `+${getCountryCallingCode("DE")}-${customerDetails.phoneNumber}`;
        // setUserInfo({ name: customerDetails.name, phoneNumber: fullNumber });
        handleDialogAction({
          type: 'contact',
          payload: { name: customerDetails.name, phoneNumber: fullNumber }
        })
      }

      if (addressData) {
        setAddressInfo(addressData as {
          pincode: string;
          buildingNumber: string;
          street: string;
          town: string;
        });
      } else if (customerDetails?.address) {
        if (order_type === OrderType.PICKUP) {
          const address = getIndianTadkaAddress()
          setAddressInfo({
            buildingNumber: address?.buildingNumber ?? '',
            town: address?.town ?? '',
            pincode: address?.pincode ?? '',
            street: address?.street ?? '',
          });
        } else {
          // setAddressInfo({
          //   buildingNumber: customerDetails.address?.buildingNumber ?? '',
          //   town: customerDetails.address?.town ?? '',
          //   pincode: customerDetails.address?.pincode ?? '',
          //   street: customerDetails.address?.street ?? '',
          // });
          handleDialogAction({
            type: 'address',
            payload: {
              buildingNumber: customerDetails.address?.buildingNumber ?? '',
              town: customerDetails.address?.town ?? '',
              pincode: customerDetails.address?.pincode ?? '',
              street: customerDetails.address?.street ?? '',
            }
          })
        }
      }

      if (deliveryTimeData) {
        //setTimeInfo(deliveryTimeData as { scheduledTime: string; asap: boolean });
        const deliverTime = deliveryTimeData as { scheduledTime: string; asap: boolean }
        handleDialogAction({
          type: 'time',
          payload: deliverTime
        })
      }

      if (deliverNoteData) {
        // setDeliveryNoteInfo(deliverNoteData as { notes: string })
        const deliveryNote = deliverNoteData as { notes: string }
        handleDialogAction({
          type: 'notes',
          payload: deliveryNote
        })
      }
    }
  }, [loading, customerDetails, order_type, handleDialogAction]);

  const isDataReady =
    userInfo.name &&
    userInfo.phoneNumber &&
    addressInfo.pincode &&
    addressInfo.buildingNumber &&
    addressInfo.street &&
    addressInfo.town
  return isDataReady ? (
    <div className="bg-white rounded-lg  mt-10 shadow p-4 space-y-4 max-w-md mx-auto">
      <h2 className="text-xl font-semibold">Order details</h2>

      <UserInfo
        openDialog={openDialog}
        handleOpen={handleOpen}
        handleClose={handleClose}
        customerDetails={userInfo}
        handleDialogAction={handleDialogAction}
      />
      <Divider sx={{ backgroundColor: '#E0E0E0', mb: 1 }} />

      <AddressInfo
        isPickup={order_type === OrderType.PICKUP}
        openDialog={openDialog}
        customerAddress={addressInfo}
        handleOpen={handleOpen}
        handleClose={handleClose}
        handleDialogAction={handleDialogAction}
      />
      <Divider sx={{ backgroundColor: '#E0E0E0', mb: 1 }} />

      <DeliveryTime
        isPickup={order_type === OrderType.PICKUP}
        openDialog={openDialog}
        initialTime={timeInfo?.scheduledTime ?? ""}
        handleOpen={handleOpen}
        handleClose={handleClose}
        handleDialogAction={handleDialogAction}
      />
      {
        order_type === OrderType.DELIVERY && (
          <>
            <Divider sx={{ backgroundColor: '#E0E0E0', mb: 1 }} />

            <DeliveryNote
              openDialog={openDialog}
              deliveryNote={deliveryNoteInfo}
              handleOpen={handleOpen}
              handleClose={handleClose}
              handleDialogAction={handleDialogAction} />
          </>
        )}
    </div>
  ) : (
    <OrderDetailsSkeleton />
  );

}

