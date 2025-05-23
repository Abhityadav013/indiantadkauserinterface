/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
          if (response.result) {
            setIsReady(true);

            const button = paymentsClient.createButton({
              buttonType: 'buy',
              onClick: () => onGooglePayClick(paymentsClient),
            });

            if (buttonContainerRef.current && buttonContainerRef.current.childElementCount === 0) {
              buttonContainerRef.current.appendChild(button);
            }
          }
        })
        .catch((err: any) => {
          console.error('Google Pay isReadyToPay failed:', err);
        });
    };

    interval = setInterval(waitForGoogle, 200);
    timeout = setTimeout(() => clearInterval(interval), 5000); // prevent infinite loop

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);


  const onGooglePayClick = (paymentsClient: any) => {
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
        // Send payment data to your server
      })
      .catch((err: any) => {
        console.error('❌ Payment error:', err);
      });
  };

  console.log('isReady::::::::',isReady)
  return (
    <div>
      {isReady ? (
        <div ref={buttonContainerRef} />
      ) : (
        <p className="text-gray-500">Loading Google Pay button…</p>
      )}
    </div>
  );
};

export default GooglePayButton;
