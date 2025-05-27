import type { NextConfig } from 'next';

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
      'static.takeaway.com'
    ], // Add your image domain here
  },
};

export default nextConfig;
