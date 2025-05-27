'use client';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { OrderType } from '@/lib/types/order_type';
import { useDispatch, useSelector } from 'react-redux';
import { setOrderType } from '@/store/slices/orderSlice';
import { RootState } from '@/store';

export default function BasketToggle() {
  const dispatch = useDispatch();
  const selected = useSelector((state: RootState) => state.order.orderType);

  const handleBasketType = (value: OrderType) => {
    dispatch(setOrderType(value));
    sessionStorage.setItem('orderType', value);
  };

  return (
    <div className="flex items-center justify-center gap-2 bg-gray-100 p-1 rounded-full w-fit shadow-sm">
      <button
        onClick={() => handleBasketType(OrderType.DELIVERY)}
        className={`flex items-center gap-1 px-4 py-1 rounded-full transition-all
          ${selected === OrderType.DELIVERY ? 'bg-white shadow font-semibold text-orange-500' : 'text-gray-500'}
        `}
      >
        <DeliveryDiningIcon fontSize="small" />
        <span className="text-sm">Delivery</span>
      </button>

      <button
        onClick={() => handleBasketType(OrderType.PICKUP)}
        className={`flex items-center gap-1 px-4 py-1 rounded-full transition-all
          ${selected === OrderType.PICKUP ? 'bg-white shadow font-semibold text-orange-500' : 'text-gray-500'}
        `}
      >
        <StorefrontIcon fontSize="small" />
        <span className="text-sm">Collection</span>
      </button>
    </div>
  );
}