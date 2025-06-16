import validator from 'validator';
import { NextRequest, NextResponse } from 'next/server';
import ApiResponse from '@/utils/ApiResponse';
import { OrderType } from '@/lib/types/order_type';
import { connectToDatabase } from '@/lib/mongodb/connect';
import { UserLocation } from '@/lib/types/user_location_type';
import UserInfo, { IUserInfoLean } from '@/lib/mongodb/models/UserInfo';
import { fetchCustomerLocationApi } from '@/lib/api/fetchCustomerLocationApi';
import { Location } from '@/lib/types/location_type';
import { getUserLocationFromLatLon } from '@/lib/api/fetchUserLocationFromLatLon';
import { fetchLocationApi } from '@/lib/api/fetchLocationApi';
import { CustomerOrder } from '@/lib/types/customer_order_type';

// import { isValidNumber } from 'libphonenumber-js';
export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const tId = request.headers.get('tid') || '';
    // const ssId = request.headers.get('session-id') || '';
    const ssId = request.headers.get('ssid') || '';
    const { customerDetails, orderType } = payload;
    const errors = [];
    // Validate required fields

    if (customerDetails.name == '' || customerDetails.phoneNumber == '') {
      const isNameGiven = customerDetails.name.trim().length > 0;
      const isPhoneNumberGiven = customerDetails.phoneNumber.trim().length > 0;

      if (!isNameGiven) {
        errors.push({ key: 'name', message: 'Please enter the name' });
      }
      if (!isPhoneNumberGiven) {
        errors.push({
          key: 'phoneNumber',
          message: 'Please enter the phone number',
        });
      }
    }
    const normalizedPhone = customerDetails.phoneNumber.startsWith('+')
      ? customerDetails.phoneNumber
      : `+49${customerDetails.phoneNumber}`;
    if (!normalizedPhone || !validator.isMobilePhone(normalizedPhone, 'de-DE')) {
      errors.push({
        key: 'phoneNumber',
        message: 'Valid German phone number is required.',
      });
    }
    if (errors.length > 0 && orderType === OrderType.PICKUP) {
      const apiResponse = new ApiResponse(400, errors, 'Validation failed.');
      return NextResponse.json(apiResponse, {
        status: apiResponse.statusCode,
      });
    }
    // Validate address fields if order type is DELIVERY
    if (orderType === OrderType.DELIVERY) {
      const addressFields = [
        'pincode',
        'buildingNumber',
        'town',
        'street',
        'displayAddress',
        'addressType',
      ];
      addressFields.forEach((field) => {
        if (!customerDetails.address?.[field]) {
          errors.push({ key: field, message: `${field} is required.` });
        }
      });

      const isValidPincode = /^\d{5}$/.test(customerDetails.address.pincode.trim());
      if (!isValidPincode) {
        errors.push({ key: 'pincode', message: 'Invalid pincode.' });
      }

      // 2. Validate buildingNumber: Check if it's alphanumeric or numeric
      const isValidBuildingNumber = /^[a-zA-Z0-9\s]+$/.test(
        customerDetails.address.buildingNumber.trim()
      );

      if (!isValidBuildingNumber) {
        errors.push({
          key: 'buildingNumber',
          message: 'Invalid buildingNumber.',
        });
      }

      // 3. Validate street: Should contain alphabetic characters, spaces, and hyphens (for streets like "Maximilianstraße")
      const isValidStreet = /^[a-zA-ZäöüßÄÖÜ0-9\s\-]+$/.test(customerDetails.address.street.trim());

      if (!isValidStreet) {
        errors.push({ key: 'isValidStreet', message: 'Invalid street.' });
      }
      const location: Location[] = await fetchLocationApi(customerDetails.address.displayAddress);
      const isValid = isValidAddress(location);
      if (location && !isValid && errors.length == 0) {
        const locationError = [
          { key: 'town', message: 'Please check the town name' },
          { key: 'street', message: 'Please check the street name.' },
          { key: 'pincode', message: 'Please check the pincode' },
        ];
        errors.concat(locationError);
      }
    }

    // Return validation errors if any
    if (errors.length > 0) {
      const apiResponse = new ApiResponse(400, errors, 'Validation failed.');
      return NextResponse.json(apiResponse, { status: apiResponse.statusCode });
    }

    // Save user info to database
    await connectToDatabase();
    console.log('Saving user info:', customerDetails);

    let userInformation = await UserInfo.findOne({
      deviceId: ssId,
      tid: tId,
    });

    let deliveryFee,
      discountPrice = 0,
      isFreeDelivery = true,
      notDeliverable = false,
      userLocation: UserLocation = { lat: 0, lng: 0 };

    if (customerDetails?.discountPrice) {
      discountPrice = customerDetails.discountPrice;
    }
    if (orderType === OrderType.DELIVERY) {
      userLocation = await fetchUserLocation(customerDetails.address.displayAddress);
      const getlocationInsights = await getUserLocationFromLatLon({
        userLocation,
      });
      if (typeof getlocationInsights !== 'boolean' && typeof getlocationInsights !== 'string') {
        deliveryFee = String(getlocationInsights);
        isFreeDelivery = false;
      } else if (typeof getlocationInsights === 'string') {
        isFreeDelivery = true;
      } else {
        isFreeDelivery = false;
        notDeliverable = true;
      }
    }
    if (userInformation && Object.keys(userInformation).length > 0) {
      if (orderType === OrderType.PICKUP) {
        userInformation.name = customerDetails.name;
        userInformation.phoneNumber = customerDetails.phoneNumber;
        userInformation.orderMethod = orderType === OrderType.DELIVERY ? 'DELIVERY' : 'PICKUP';
        userInformation.discountPrice = discountPrice;
      } else {
        userInformation.address = customerDetails.address;
        userInformation.deliveryFee = deliveryFee;
        userInformation.isFreeDelivery = isFreeDelivery;
        userInformation.notDeliverable = notDeliverable;
        userInformation.orderMethod = orderType === OrderType.DELIVERY ? 'DELIVERY' : 'PICKUP';
        userInformation.discountPrice = discountPrice;
      }
      // Update existing user info
    } else {
      userInformation = new UserInfo({
        name: customerDetails.name,
        phoneNumber: customerDetails.phoneNumber,
        ...(orderType === OrderType.DELIVERY && {
          address: customerDetails.address,
        }),
        deviceId: ssId,
        tid: tId,
        orderMethod: orderType === OrderType.DELIVERY ? 'DELIVERY' : 'PICKUP',
        userLocation: userLocation,
        deliveryFee: deliveryFee,
        isFreeDelivery: isFreeDelivery,
        notDeliverable: notDeliverable,
        discountPrice: discountPrice,
      });
    }
    await userInformation.save();

    const userData = userInformation.toObject();
    delete userData._id;
    delete userData.deviceId;
    delete userData.tid;

    const updateUserDetails: CustomerOrder = {
      customerDetails: {
        name: userData.name,
        phoneNumber: userData.phoneNumber,
        address: userData.address || {},
        isFreeDelivery: userData.isFreeDelivery,
        deliveryFee: userData.deliveryFee,
        notDeliverable: userData.notDeliverable,
        discountPrice: discountPrice,
      },
      orderType: userData.orderMethod as OrderType,
    };

    // Success response
    return NextResponse.json(
      new ApiResponse(200, { ...updateUserDetails }, 'User information saved successfully.')
    );
  } catch (error) {
    console.error('Internal Error:', error);
    return NextResponse.json(
      new ApiResponse(500, { error: `Internal Server Error: ${error}` }, 'An error occurred.')
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const ssId = request.headers.get('ssid') || '';
    const userInfo = await UserInfo.findOne({ deviceId: ssId })
      .select('-_id -deviceId -tid')
      .lean<IUserInfoLean>();

    if (!userInfo) {
      return NextResponse.json(new ApiResponse(404, {}, 'User info not found.'));
    }

    const formatPhoneNumber = (phone: string): string => {
      // Remove any non-digit characters like '+' or spaces
      const cleaned = phone.replace(/\D/g, '');
      const match = cleaned.match(/^(\d{2})(\d+)$/); // e.g., '49' and the rest
      if (!match) return phone;
      return match[2];
    };
    const userDetails: CustomerOrder = {
      customerDetails: {
        name: userInfo.name,
        phoneNumber: formatPhoneNumber(userInfo.phoneNumber),
        address: userInfo.address || {},
        isFreeDelivery: userInfo.isFreeDelivery,
        deliveryFee: userInfo.deliveryFee,
        notDeliverable: userInfo.notDeliverable,
      },
      orderType: userInfo.orderMethod as OrderType,
    };

    return NextResponse.json(
      new ApiResponse(200, { ...userDetails }, 'User info fetched successfully.')
    );
  } catch (error) {
    console.error('Internal Error:', error);
    return NextResponse.json(
      new ApiResponse(
        500,
        { error: `Internal Server Error: ${error}` },
        'Failed to fetch user info.'
      )
    );
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchUserLocation = async (fetchAddress: string) => {
  let isFetched = false;
  const MAX_TRIES = 3;
  let attempt = 1;
  let locationData: UserLocation = { lat: 0, lng: 0 }; // Initialize with default values
  while (!isFetched && attempt <= MAX_TRIES) {
    locationData = await fetchCustomerLocationApi(fetchAddress);
    if (
      locationData &&
      locationData.lat !== 0 &&
      locationData.lng !== 0 &&
      Object.keys(locationData).length > 0
    ) {
      isFetched = true;
      break;
    }
    await sleep(1000);
    attempt++;
  }
  return locationData;
};

const isValidAddress = (response: Location[]): boolean => {
  return (
    Array.isArray(response) &&
    response.length > 0 &&
    !!response[0].lat &&
    !!response[0].lon &&
    !!response[0].display_name
  );
};
