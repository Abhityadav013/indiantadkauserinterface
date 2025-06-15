export const calculateCouponDiscount = (cartAmount: number, discount: number): number => {
  if (cartAmount <= 0 || discount <= 0) return cartAmount;

  const discountAmount = (cartAmount * discount) / 100;
  const finalAmount = cartAmount - discountAmount;
  return parseFloat(finalAmount.toFixed(2)); // return rounded to 2 decimal places
};
