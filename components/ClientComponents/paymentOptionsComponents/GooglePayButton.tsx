/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    google?: any;
  }
}

const GooglePayButton = () => {
  const [isReady, setIsReady] = useState(false);
  const buttonContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let timeout: NodeJS.Timeout;

    const waitForGoogle = () => {
      if (typeof window !== 'undefined' && window.google?.payments?.api) {
        clearInterval(interval);
        clearTimeout(timeout);
        initGooglePay();
      }
    };

    const initGooglePay = () => {
      console.log("🔧 Initializing Google Pay...");

      const paymentsClient = new window.google.payments.api.PaymentsClient({
        environment: 'TEST',
      });

      const isReadyToPayRequest = {
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [
          {
            type: 'CARD',
            parameters: {
              allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
              allowedCardNetworks: ['MASTERCARD', 'VISA'],
            },
          },
        ],
      };

      paymentsClient.isReadyToPay(isReadyToPayRequest)
        .then((response: any) => {
          console.log("✅ Google Pay is ready to pay", response);

          if (response.result) {
            setIsReady(true);

            const button = paymentsClient.createButton({
              buttonType: 'buy',
              onClick: () => onGooglePayClick(paymentsClient),
            });

            console.log("Created button:", button);
            console.log("button instanceof HTMLElement?", button instanceof HTMLElement);

            if (buttonContainerRef.current) {
              buttonContainerRef.current.innerHTML = ""; // clear previous children
              if (button instanceof HTMLElement) {
                // Set explicit size for the button container and button to be visible
                button.style.width = '240px';
                button.style.height = '40px';
                button.style.display = 'inline-block';

                buttonContainerRef.current.style.minWidth = '240px';
                buttonContainerRef.current.style.minHeight = '40px';
                buttonContainerRef.current.style.display = 'inline-block';
                buttonContainerRef.current.style.border = '1px solid red'; // temporary border for debugging

                buttonContainerRef.current.appendChild(button);
                console.log("🟢 Google Pay button appended");
              } else {
                console.error("❌ Google Pay button is not an HTMLElement, cannot append");
              }
            }
          }
        })
        .catch((err: any) => {
          console.error('Google Pay isReadyToPay failed:', err);
        });
    };

    interval = setInterval(waitForGoogle, 200);
    timeout = setTimeout(() => clearInterval(interval), 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);


  const onGooglePayClick = (paymentsClient: any) => {
    console.log("🛒 Google Pay button clicked");
    const paymentDataRequest = {
      apiVersion: 2,
      apiVersionMinor: 0,
      allowedPaymentMethods: [
        {
          type: 'CARD',
          tokenizationSpecification: {
            type: 'PAYMENT_GATEWAY',
            parameters: {
              gateway: 'stripe',
              'stripe:version': '2020-08-27',
              'stripe:publishableKey': 'pk_test_51R2Ypp2eUjwr9TPLqLOiqfN5kLkVPBJhnYugvQKmlCcVdjD81n58O5QhnX2ZRHdYNTb4d1C8RrltbUoJeuCeBYvc00QiopzFPL',
            },
          },
          parameters: {
            allowedCardNetworks: ['MASTERCARD', 'VISA'],
            allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
          },
        },
      ],
      merchantInfo: {
        merchantName: 'My Restaurant',
      },
      transactionInfo: {
        totalPriceStatus: 'FINAL',
        totalPrice: '15.00',
        currencyCode: 'EUR',
      },
    };

    paymentsClient.loadPaymentData(paymentDataRequest)
      .then((paymentData: any) => {
        console.log('✅ Payment success:', paymentData);
        // You would normally send paymentData to your backend here
      })
      .catch((err: any) => {
        console.error('❌ Payment failed:', err);
      });
  };

  return (
    <div>
      {isReady ? (
        <div
          ref={buttonContainerRef}
          style={{ border: '1px solid red', minHeight: '50px', minWidth: '250px' }}
        />
      ) : (
        <p className="text-gray-500">Loading Google Pay button…</p>
      )}
    </div>
  );
};

export default GooglePayButton;
