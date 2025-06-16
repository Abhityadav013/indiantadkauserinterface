import { OrderSuccessSummary } from '@/lib/types/order_summary';
import { formatPrice } from './valueInEuros';
import { OrderType } from '@/lib/types/order_type';

export function generateOrderConfirmationEmail(order: OrderSuccessSummary): string {
  const { displayId, orderType, orderItems, orderAmount, createdAt, deliveryAddress } = order;

  const formattedDate = new Date(createdAt).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const serviceFee = (orderAmount.orderTotal * 2.5) / 100;
  const cappedServiceFee = serviceFee < 0.99 ? serviceFee : 0.99;
  const deliveryFee = orderAmount.deliveryFee ?? 0;
  const tipAmount = orderAmount.tipAmount ?? 0;
  const discountAmount = orderAmount.discount?.amount ?? 0;
  const total = Number(orderAmount.orderTotal) + Number(deliveryFee) + Number(cappedServiceFee);

  const itemsHtml = orderItems
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 8px;">${item.name}<br/><small style="color:#666;">Qty: ${item.quantity}</small></td>
        <td style="text-align: right; padding: 8px;">${formatPrice(Number(item.price))}</td>
      </tr>`
    )
    .join('');

  const addressHtml =
    order.orderType === OrderType.DELIVERY && deliveryAddress
      ? `
      <tr>
        <td colspan="2" style="padding: 12px 0;">
          <strong>Delivery Address:</strong><br/>
          <div style="background: #f9f9f9; padding: 10px; border-radius: 4px;">
            ${deliveryAddress}
          </div>
        </td>
      </tr>`
      : '';

  const discountHtml =
    discountAmount > 0
      ? `
      <tr>
        <td style="padding: 8px; color: green;">Discount (${orderAmount.discount?.code})</td>
        <td style="text-align: right; padding: 8px; color: green;">–${formatPrice(discountAmount)}</td>
      </tr>`
      : '';

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Order Confirmation</title>
  </head>
  <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <table width="100%" style="max-width: 600px; background-color: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #ddd;">
            <tr>
              <td align="center" style="padding-bottom: 16px;">
                <h2 style="margin: 0; color: #333;">Order Confirmation</h2>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding-bottom: 8px;">
                <span style="background-color: #1976d2; color: #fff; padding: 6px 14px; border-radius: 20px; font-size: 14px;">
                  ${orderType}
                </span>
              </td>
            </tr>
            <tr>
              <td align="center" style="color: #555; font-size: 14px; padding-bottom: 16px;">
                Order #${displayId} • ${formattedDate}
              </td>
            </tr>

            <tr><td><hr style="border: none; border-top: 1px solid #eee;" /></td></tr>

            <tr>
              <td>
                <h3 style="margin: 20px 0 10px;">Order Summary</h3>
                <table width="100%" cellpadding="0" cellspacing="0">
                  ${itemsHtml}
                </table>
              </td>
            </tr>

            <tr>
              <td>
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 16px;">
                  <tr>
                    <td style="padding: 8px;">Subtotal:</td>
                    <td style="text-align: right; padding: 8px;">${formatPrice(orderAmount.orderTotal)}</td>
                  </tr>
                  ${discountHtml}
                  ${
                    deliveryFee > 0
                      ? `
                    <tr>
                      <td style="padding: 8px;">Delivery Fee:</td>
                      <td style="text-align: right; padding: 8px;">${formatPrice(deliveryFee)}</td>
                    </tr>
                  `
                      : ''
                  }
                  ${
                    tipAmount > 0
                      ? `
                    <tr>
                      <td style="padding: 8px;">Tip:</td>
                      <td style="text-align: right; padding: 8px;">${formatPrice(tipAmount)}</td>
                    </tr>
                  `
                      : ''
                  }
                  <tr>
                    <td style="padding: 8px;">Service Fee (2.5%, max €0.99):</td>
                    <td style="text-align: right; padding: 8px;">${formatPrice(cappedServiceFee)}</td>
                  </tr>
                  <tr>
                    <td colspan="2"><hr style="border: none; border-top: 1px solid #ccc; margin: 10px 0;" /></td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; font-weight: bold;">Total:</td>
                    <td style="text-align: right; padding: 8px; font-weight: bold;">${formatPrice(total)}</td>
                  </tr>
                </table>
              </td>
            </tr>

            ${addressHtml}

            <tr>
              <td align="center" style="padding-top: 20px;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || '#'}" style="display: inline-block; padding: 10px 20px; background-color: #1976d2; color: #fff; text-decoration: none; border-radius: 4px;">
                  Back to Website
                </a>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}
