import { CustomerDetails, CustomerOrder } from '@/lib/types/customer_order_type';
import { ErrorResponse } from '@/lib/types/error_type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AddressState {
  customerDetails: CustomerDetails;
  customerOrder: CustomerOrder;
  formError: ErrorResponse;
  addressModel: boolean;
  loading: boolean;
  error: string | null | ErrorResponse;
}

const initialState: AddressState = {
  customerDetails: {} as CustomerDetails,
  customerOrder: {} as CustomerOrder,
  formError: [],
  addressModel: false,
  loading: false,
  error: null,
};

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    fetchCustomerDetailsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCustomerDetailsSuccess: (state, action: PayloadAction<CustomerDetails>) => {
      state.loading = false;
      state.customerDetails = action.payload;
      state.error = null;
    },
    fetchCustomerDetailsFailure: (state, action: PayloadAction<ErrorResponse>) => {
      state.loading = false;
        state.formError = action.payload;
      state.error = action.payload;
    },

    openAddressModel: (state) => {
      state.loading = true;
      state.addressModel = true;
    },
    closeAddressModel: (state) => {
      state.loading = true;
      state.addressModel = false;
    },
    // ✅ New: Set full CustomerOrder
    setCustomerOrderState: (state, action: PayloadAction<CustomerOrder>) => {
      state.customerOrder = action.payload;
    },

    // ✅ Optional: Reset all address-related state
    resetAddressState: () => initialState,
  },
});

export const {
  fetchCustomerDetailsStart,
  fetchCustomerDetailsSuccess,
  fetchCustomerDetailsFailure,
  openAddressModel,
  closeAddressModel,
  setCustomerOrderState,
  resetAddressState,
} = addressSlice.actions;

export default addressSlice.reducer;
