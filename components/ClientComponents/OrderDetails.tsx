'use client';

import { useEffect, useState } from 'react';
import { Divider } from '@mui/material';
import UserInfo from './checkoutComponents/UserInfo';
import { useAddressDetails } from '@/hooks/useAddressDetails';
import { getCountryCallingCode } from 'libphonenumber-js';
import { OrderDetailsSummary } from '@/lib/types/order_details_type';
import { DialogType } from '@/lib/types/dialog_type';
import { dialogHandlers, getDialogDataFromSession } from '@/lib/updateCustomerOrderDetails';
import AddressInfo from './checkoutComponents/AddressInfo';
// import { UserAddress } from '@/lib/types/address_type';
import DeliveryTime from './checkoutComponents/DeliveryTime';
import DeliveryNote from './checkoutComponents/DeliveryNote';
// import OrderDetailsSkeleton from '../Skeletons/OrderDetailsSkeleton';
import { OrderType } from '@/lib/types/order_type';
import { getIndianTadkaAddress } from '@/utils/getRestroAddress';
import { RootState } from '@/store';
import { useSelector } from 'react-redux';

export default function OrderDetails() {
  const [openDialog, setOpenDialog] = useState<null | 'contact' | 'address' | 'time' | 'notes'>(null);

  const handleOpen = (dialog: typeof openDialog) => setOpenDialog(dialog);
  const handleClose = () => setOpenDialog(null);
  const [userInfo, setUserInfo] = useState<{ name: string, phoneNumber: string }>({ name: '', phoneNumber: '' });
  const [addressInfo, setAddressInfo] = useState<{ pincode: string, buildingNumber: string, street: string, town: string }>({ pincode: '', buildingNumber: '', street: '', town: '' })
  const [timeInfo, setTimeInfo] = useState<{ asap: boolean; scheduledTime: string } | null>(null);
  const [deliveryNoteInfo, setDeliveryNoteInfo] = useState<{ notes: string }>({ notes: "" })
  const { loading, customerDetails } = useAddressDetails()
  const order_type = useSelector((state: RootState) => state.order.orderType);
  useEffect(() => {
    // Only run when loading is false
    if (!loading) {
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
        setUserInfo({ name: customerDetails.name, phoneNumber: fullNumber });
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
          setAddressInfo({
            buildingNumber: customerDetails.address?.buildingNumber ?? '',
            town: customerDetails.address?.town ?? '',
            pincode: customerDetails.address?.pincode ?? '',
            street: customerDetails.address?.street ?? '',
          });
        }
      }

      if (deliveryTimeData) {
        setTimeInfo(deliveryTimeData as { scheduledTime: string; asap: boolean });
      }

      if (deliverNoteData) {
        setDeliveryNoteInfo(deliverNoteData as { notes: string })
      }
    }
  }, [loading, customerDetails, order_type]);

  const handleDialogAction = <T extends Exclude<DialogType, null>>(data: OrderDetailsSummary<T>): void => {
    const handler = dialogHandlers[data.type];
    const storedData = handler(data.payload); // Get the stored data after calling the handler
    setOpenDialog(null)

    // Conditionally update the state based on the dialog type
    if (data.type === 'contact') {
      // If 'contact' dialog, update user info
      setUserInfo(storedData as { name: string; phoneNumber: string });
    } else if (data.type === 'address') {
      // If 'address' dialog, update address info
      setAddressInfo(storedData as { buildingNumber: string; street: string; pincode: string; town: string });
    } else if (data.type === 'time') {
      // If 'time' dialog, you can add logic for time
      // For example:
      setTimeInfo(storedData as { scheduledTime: string, asap: boolean });
    } else if (data.type === 'notes') {
      // If 'notes' dialog, handle notes info
      // For example:
      setDeliveryNoteInfo(storedData as { notes: string });
    }
  };
  const isDataReady =
    userInfo.name &&
    userInfo.phoneNumber &&
    addressInfo.pincode &&
    addressInfo.buildingNumber &&
    addressInfo.street &&
    addressInfo.town
    console.log('isDataReady:::::::::',isDataReady)
        console.log('userInfo:::::::::',userInfo)
           console.log('addressInfo:::::::::',addressInfo)
  // return isDataReady ? (
  //   <div className="bg-white rounded-lg  mt-10 shadow p-4 space-y-4 max-w-md mx-auto">
  //     <h2 className="text-xl font-semibold">Order details</h2>

  //     <UserInfo
  //       openDialog={openDialog}
  //       handleOpen={handleOpen}
  //       handleClose={handleClose}
  //       customerDetails={userInfo}
  //       handleDialogAction={handleDialogAction}
  //     />
  //     <Divider sx={{ backgroundColor: '#E0E0E0', mb: 1 }} />

  //     <AddressInfo
  //       isPickup={order_type === OrderType.PICKUP}
  //       openDialog={openDialog}
  //       customerAddress={addressInfo}
  //       handleOpen={handleOpen}
  //       handleClose={handleClose}
  //       handleDialogAction={handleDialogAction}
  //     />
  //     <Divider sx={{ backgroundColor: '#E0E0E0', mb: 1 }} />

  //     <DeliveryTime
  //       isPickup={order_type === OrderType.PICKUP}
  //       openDialog={openDialog}
  //       initialTime={timeInfo?.scheduledTime ?? ""}
  //       handleOpen={handleOpen}
  //       handleClose={handleClose}
  //       handleDialogAction={handleDialogAction}
  //     />
  //     {
  //       order_type === OrderType.DELIVERY && (
  //         <>
  //           <Divider sx={{ backgroundColor: '#E0E0E0', mb: 1 }} />

  //           <DeliveryNote
  //             openDialog={openDialog}
  //             deliveryNote={deliveryNoteInfo}
  //             handleOpen={handleOpen}
  //             handleClose={handleClose}
  //             handleDialogAction={handleDialogAction} />
  //         </>
  //       )}
  //   </div>
  // ) : (
  //   <OrderDetailsSkeleton />
  // );

  return (
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
  )

}

