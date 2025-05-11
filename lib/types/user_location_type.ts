export interface UserLocation {
    lat: number;
    lng: number;
  }
  
  export interface UserState {
    userLocation: UserLocation | null;
  
    isLoading: boolean;
  }
  