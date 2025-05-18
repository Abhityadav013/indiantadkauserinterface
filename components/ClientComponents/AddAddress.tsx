import { IconButton, TextField, Drawer, Typography, Button, Chip, FormHelperText, Autocomplete, useMediaQuery } from '@mui/material'
import React, { useEffect, useState } from 'react'
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import WorkIcon from "@mui/icons-material/Work";
import NotListedLocationIcon from '@mui/icons-material/NotListedLocation';
import { OrderType } from '@/lib/types/order_type';
import { Address } from '@/lib/types/address_type';
import { ErrorResponse } from '@/lib/types/error_type';
import { CustomerOrder } from '@/lib/types/customer_order_type';
import { PostCodePlace } from '@/lib/types/location_type';
import { fetchPlaceByPostalCode } from '@/lib/api/fetchPlaceByPostalCode';
import { fetchStreetsByPostalCode } from '@/lib/api/fetchStreetsByPostalCode';
import PhoneInput from './PhoneInput';
import { CountryCode, getCountryCallingCode } from 'libphonenumber-js';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import { useDispatch } from 'react-redux';
import { setOrderType } from '@/store/slices/orderSlice';
import StorefrontIcon from '@mui/icons-material/Storefront';

interface AddressFormProps {
  onSubmit: (values: { userInfo: UserInfo, orderType: OrderType, address?: AddressInput }) => void;
  isOpen: boolean;
  onClose: () => void; // onClose function to close the drawer
  address: Address,
  error: ErrorResponse | null;
  setFormError: (values: ErrorResponse) => void
  formValues: CustomerOrder;
}

export interface AddressInput {
  buildingNumber: string
  street: string;
  town: string;
  pincode: string;
  addressType: string


}
export interface UserInfo {
  name: string;
  phoneNumber: string
}

const buttonTextMap = {
  delivery: 'SAVE ADDRESS & PROCEED',
  pickup: 'CONFIRM & PROCEED',
};


const AddNewAddress: React.FC<AddressFormProps> = ({
  onSubmit,
  isOpen,
  onClose,
  address,
  error,
  setFormError,
  formValues,
}

) => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const [selectedCountry] = useState<CountryCode>("DE");
  const [name, setUserName] = React.useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>(""); // Phone number for sign-up
  const [buildingNumber, setBuildingNumber] = React.useState("");
  const [street, setStreet] = React.useState<string>("");
  const [town, setTown] = React.useState("");
  const [pincode, setPincode] = React.useState<string>("");
  const [addressType, setAddressType] = React.useState("");
  const [orderType, set_Order_Type] = React.useState<OrderType>(OrderType.DELIVERY);
  const [currentFormError, setCurrentFormError] = React.useState<ErrorResponse>([]);
  const [streetOptions, setStreetOptions] = useState<string[]>([]);
  const dispatch = useDispatch();
  useEffect(() => {
    const hasCustomerDetails =
      formValues.customerDetails &&
      Object.keys(formValues.customerDetails).length > 0;

    if (hasCustomerDetails) {
      const customer = formValues.customerDetails;
      setUserName(customer.name || "");
      setPhoneNumber(customer.phoneNumber || "");
      if (customer.address && Object.keys(customer.address).length > 0) {
        setTown(customer.address.town || "");
        setBuildingNumber(customer.address.buildingNumber || "");
        setStreet(customer.address.street || "");
        setPincode(customer.address.pincode || "");
        setAddressType(customer.address.addressType?.toLowerCase() || "home");
      }
      set_Order_Type(formValues.orderType || OrderType.DELIVERY);
    } else if (address) {
      setStreet(address.road || "");
      setPincode(address.postcode || "");
      setBuildingNumber(address.house_number || "");
      setTown(
        address.city ||
        address.town ||
        address.city_district ||
        address.village ||
        ""
      );
    }
  }, [formValues, address]);


  const handlePostalCodeChange = async (value: string): Promise<void> => {
    setPincode(value);
    if (value.length === 5) {
      const pinCodeArea: PostCodePlace[] = await fetchPlaceByPostalCode(value); // Fetch place and streets when postal code is complete
      if (pinCodeArea && pinCodeArea.length > 0) {
        //             setTown(formValues.customerDetails.address.town || "");
        setTown(pinCodeArea[0]['place name'] || "")
        const streets = await fetchStreetsByPostalCode(value)
        setStreetOptions(streets);
        setCurrentFormError((prev) => prev.filter((error) => error.key !== 'pincode'));
      } else {
        setTown("")
        setStreetOptions([]);
        setCurrentFormError([{ key: 'pincode', message: 'Invalid pincode. Please enter correct pincode' }])
      }
    } else {
      setTown("")
      setStreet("");
      setBuildingNumber("");
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (event: any) => {
    event.preventDefault(); // Prevent default form submission behavior
    try {
      if (orderType === OrderType.DELIVERY) {
        await onSubmit({
          userInfo: { name, phoneNumber: `+${getCountryCallingCode(selectedCountry)}${phoneNumber}` },
          orderType: orderType,
          address: { buildingNumber, street, town, pincode, addressType: addressType.toUpperCase() },

        });
      } else {
        await onSubmit({
          userInfo: { name, phoneNumber: `+${getCountryCallingCode(selectedCountry)}${phoneNumber}` },
          orderType: orderType,
        });
      }
      // Call the passed function for form submission
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  // const handleOrderTypeMethodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setOrderType(event.target.value as OrderType);
  // };


  const handleOrderTypeMethodChange = (value: OrderType) => {
    set_Order_Type(value);
    dispatch(setOrderType(value));
    sessionStorage.setItem("orderType", value)
  }


  const getErrorMessage = (key: string) => {
    if (error && error.length == 0) {
      return currentFormError?.find((err) => err.key === key)?.message || null;
    }
    else {
      return error?.find((err) => err.key === key)?.message || null;
    }

  };

  return (
    <Drawer
      anchor={isMobile ? "bottom" : "left"}
      open={isOpen}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: "100%",
          maxWidth: "500px",
          height: "100%",
          //  padding: isMobile ? "16px" : "32px", // Adjust padding based on screen size
          // borderRadius: isMobile ? "20px" : "30px", // Add rounded corners on mobile
        },
      }}
    >
      <div className="w-full p-6 relative">
        {/* Close button */}
        <IconButton
          edge="start"
          color="inherit"
          onClick={onClose}
          sx={{ position: "absolute", top: 20, right: 20 }}
        >
          <CloseIcon />
        </IconButton>


        {/* Input fields */}
        <div className='px-10'>
          {/* <FormControl component="fieldset">
            <RadioGroup
              aria-label="payment-method"
              value={orderType}
              onChange={handleOrderTypeMethodChange}
              row
            >
              <FormControlLabel
                value="PICKUP"
                control={<Radio />}
                label="Collection"

              />
              <StorefrontIcon fontSize="small" />
              <FormControlLabel
                value="DELIVERY"
                control={<Radio />}
                label="Delivery"
              />
            </RadioGroup>
          </FormControl> */}


          <div className="w-full flex justify-center mb-4">
            <div className="flex items-center justify-center gap-2 bg-gray-100 p-1 rounded-full shadow-sm w-fit">
              <button
                onClick={() => handleOrderTypeMethodChange(OrderType.DELIVERY)}
                className={`flex items-center gap-1 px-4 py-1 rounded-full transition-all
        ${orderType === OrderType.DELIVERY ? 'bg-white shadow font-semibold text-orange-500' : 'text-gray-500'}
      `}
              >
                <DeliveryDiningIcon fontSize="small" />
                <span className="text-sm">Delivery</span>
              </button>

              <button
                onClick={() => handleOrderTypeMethodChange(OrderType.PICKUP)}
                className={`flex items-center gap-1 px-4 py-1 rounded-full transition-all
        ${orderType === OrderType.PICKUP ? 'bg-white shadow font-semibold text-orange-500' : 'text-gray-500'}
      `}
              >
                <StorefrontIcon fontSize="small" />
                <span className="text-sm">Collection</span>
              </button>
            </div>
          </div>

          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setUserName(e.target.value)}
            className="mb-4"
            required
            error={!!getErrorMessage('name')}
            helperText={getErrorMessage('name')}
          />

          <div className="my-4">
            <PhoneInput
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              selectedCountry={selectedCountry}
            />
            {getErrorMessage('phoneNumber') && (
              <FormHelperText error>
                {getErrorMessage("phoneNumber")}
              </FormHelperText>
            )}
          </div>
          {
            orderType === OrderType.DELIVERY && (
              <>
                <TextField
                  label="Pincode"
                  variant="outlined"
                  fullWidth
                  value={pincode}
                  onChange={(e) => handlePostalCodeChange(e.target.value)}
                  sx={{ marginBottom: 1 }}
                  required
                  error={!!getErrorMessage("pincode")}
                  helperText={getErrorMessage("pincode")} // Show error for email
                />
                {pincode.length < 5 && (
                  <Typography
                    variant="caption"
                    sx={{ color: 'primary.main', mb: 0.5 }}
                  >
                    Enter pincode to unlock this field
                  </Typography>
                )}

                {pincode.length >= 5 && !!getErrorMessage("pincode") && (
                  <Typography
                    variant="caption"
                    sx={{ color: 'primary.main', mb: 0.5 }}
                  >
                    Enter correct pincode to unlock this field
                  </Typography>
                )}
                <TextField
                  label="Building No."
                  variant="outlined"
                  fullWidth
                  value={buildingNumber}
                  onChange={(e) => setBuildingNumber(e.target.value)}
                  sx={{ marginBottom: 1 }}
                  required
                  slotProps={{
                    input: {
                      readOnly: pincode.length < 5,
                    },
                  }}
                  error={!!getErrorMessage("buildingNumber")}
                  helperText={getErrorMessage("buildingNumber")}// Show error for email
                />
                {pincode.length < 5 && (
                  <Typography
                    variant="caption"
                    sx={{ color: 'primary.main', mb: 0.5 }}
                  >
                    Enter pincode to unlock this field
                  </Typography>
                )}

                {pincode.length >= 5 && !!getErrorMessage("pincode") && (
                  <Typography
                    variant="caption"
                    sx={{ color: 'primary.main', mb: 0.5 }}
                  >
                    Enter correct pincode to unlock this field
                  </Typography>
                )}
                <Autocomplete
                  freeSolo
                  options={streetOptions}
                  inputValue={street}
                  onInputChange={(event, newInputValue) => setStreet(newInputValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Street"
                      variant="outlined"
                      fullWidth
                      required
                      inputProps={{
                        ...params.inputProps,
                        readOnly: pincode.length < 5, // ✅ Make it readonly conditionally
                      }}
                      error={!!getErrorMessage("street")}
                      helperText={getErrorMessage("street")}
                      sx={{ marginBottom: 1 }}
                    />
                  )}
                />
                {pincode.length < 5 && (
                  <Typography
                    variant="caption"
                    sx={{ color: 'primary.main', mb: 0.5 }}
                  >
                    Enter pincode to unlock this field
                  </Typography>
                )}

                {pincode.length >= 5 && !!getErrorMessage("pincode") && (
                  <Typography
                    variant="caption"
                    sx={{ color: 'primary.main', mb: 0.5 }}
                  >
                    Enter correct pincode to unlock this field
                  </Typography>
                )}
                <TextField
                  label="City or Town"
                  variant="outlined"
                  fullWidth
                  value={town}
                  onChange={(e) => setTown(e.target.value)}
                  sx={{ marginBottom: 1 }}
                  required
                  error={!!getErrorMessage("town")}
                  helperText={getErrorMessage("town")}
                  slotProps={{
                    input: {
                      readOnly: pincode.length < 5,
                    },
                  }}
                />

                {/* Address Type Chips */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <Chip
                    icon={<HomeIcon />}
                    label="Home"
                    clickable
                    color={addressType === "home" ? "primary" : "default"}
                    onClick={() => setAddressType("home")}
                    variant={addressType === "home" ? "filled" : "outlined"}
                  />
                  <Chip
                    icon={<WorkIcon />}
                    label="Work"
                    clickable
                    color={addressType === "work" ? "primary" : "default"}
                    onClick={() => setAddressType("work")}
                    variant={addressType === "work" ? "filled" : "outlined"}
                  />
                  <Chip
                    icon={<NotListedLocationIcon />}
                    label="Other"
                    clickable
                    color={addressType === "other" ? "primary" : "default"}
                    onClick={() => setAddressType("other")}
                    variant={addressType === "other" ? "filled" : "outlined"}
                  />
                </div>
              </>
            )
          }

          {/* Submit Button */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={(event) => { handleSubmit(event); setFormError([]) }}
            sx={{
              height: '46px',
              background:'#FF6347'
            }}
          >
             {orderType ? buttonTextMap[orderType.toLowerCase() as keyof typeof buttonTextMap] : 'PROCEED'}
          </Button>
        </div>
      </div>
    </Drawer>
  );
}

export default AddNewAddress
