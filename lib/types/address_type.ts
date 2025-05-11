export interface Address {
    house_number?: string;
    road?: string;
    city_district?: string;
    city?: string;
    town?: string;
    village?:string;
    state?: string;
    postcode?: string;
    country?: string;
    country_code?: string;
  }
  
  export interface UserAddress {
    displayAddress: string;
    buildingNumber: string;
    street: string;
    town: string;
    pincode: string;
    addressType: string;
  }
  