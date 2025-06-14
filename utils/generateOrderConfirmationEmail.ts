import { OrderSuccessSummary } from "@/lib/types/order_summary";

export function generateOrderConfirmationEmail(order: OrderSuccessSummary): string {
  const { displayId, orderType, orderItems, orderAmount, createdAt } = order;

  const formattedDate = new Date(createdAt).toLocaleString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const orderTypeBadge = `<span style="display: inline-block; background-color: #1976d2; color: white; padding: 6px 12px; border-radius: 20px; font-size: 14px;">
    ${orderType}
  </span>`;

  const itemsHtml = orderItems
    .map(
      (item) => `
      <div style="display: flex; justify-content: space-between; padding: 5px 0; border-top: 1px solid #eee;">
        <div>
          <strong>${item.name}</strong><br />
          <span style="font-size: 13px; color: #777;">Quantity: ${item.quantity}</span>
        </div>
        <div style="font-weight: bold;">€${item.price.toFixed(2)}</div>
      </div>
    `
    )
    .join("");

  const deliveryFee = orderAmount.deliveryFee ?? 0;
  const tipAmount = orderAmount.tipAmount ?? 0;
  const total =
    (orderAmount.orderTotal ?? 0) + deliveryFee + tipAmount;

  const html = `
  <!DOCTYPE html>
  <html>
    <head><meta charset="UTF-8" /></head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding: 20px;">
        <tr>
          <td align="center">
            <table width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; padding: 20px; border: 1px solid #ddd;">
              <tr><td align="center" style="padding-bottom: 10px;"><h2 style="margin: 0; color: #333;">Order Confirmation</h2></td></tr>
              <tr><td align="center" style="padding: 10px 0;">${orderTypeBadge}</td></tr>
              <tr><td align="center" style="color: #666; font-size: 14px; padding-bottom: 10px;">Order #${displayId} • ${formattedDate}</td></tr>
              <tr><td style="border-bottom: 1px solid #ccc; margin: 20px 0;"></td></tr>
              <tr><td style="padding: 15px 0; font-weight: bold; font-size: 16px;">Order Summary</td></tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #eee; border-radius: 5px;">
                  ${itemsHtml}
                </td>
              </tr>
              <tr>
                <td style="padding: 20px 0;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding: 5px 0;">Cart Subtotal:</td>
                      <td align="right">€${orderAmount.orderTotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td style="padding: 5px 0;">Delivery Fee:</td>
                      <td align="right">€${deliveryFee.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td style="padding: 5px 0;">Tip:</td>
                      <td align="right">€${tipAmount.toFixed(2)}</td>
                    </tr>
                    <tr><td colspan="2"><hr style="border: none; border-top: 1px solid #ddd; margin: 10px 0;" /></td></tr>
                    <tr>
                      <td style="font-weight: bold; font-size: 16px;">Total:</td>
                      <td align="right" style="font-weight: bold; font-size: 16px;">€${total.toFixed(2)}</td>
                    </tr>
                  </table>
                </td>
              </tr>

              <tr>
                <td align="center" style="padding: 20px 10px; color: #888; font-size: 13px;">
                  Thank you for using our service! 🍽️<br />
                  For assistance, contact us anytime.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>`;

  return html;
}
