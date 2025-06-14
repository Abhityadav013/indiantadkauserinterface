import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      'testing.indiantadka.eu',
      'https://www.google.com/',
      'http://localhost:5000/api/v1',
      'www.paypalobjects.com',
      'flagcdn.com',
      'stripe.com',
      'www.flaticon.com',
      'static.takeaway.com',
      'https://pay.google.com'
    ], // Add your image domain here
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
