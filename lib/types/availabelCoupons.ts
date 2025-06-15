export interface GetCouponResponse {
  data: {
    id: string;
    label: string;
    discount: number;
    startAt: Date;
    endBy: Date;
  };
}

export interface GetCouponData {
  id: string;
  label: string;
  discount: number;
  startAt: Date;
  endBy: Date;
}

export interface AvailableCoupons{
   id: string;
  label: string;
  discount: number;
  startAt: Date;
  endBy: Date;
}
