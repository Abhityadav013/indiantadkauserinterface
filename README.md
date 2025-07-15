# Indian Tadka – Restaurant Web Platform

A modern, full-stack web application for Indian Tadka, a restaurant bringing authentic Indian cuisine to Germany. This platform enables customers to explore the menu, place online orders, make reservations, view offers, and interact with a smart chatbot assistant—all with a seamless, responsive user experience.

## Features

- **Homepage Product Tour**: Interactive, branded tour for first-time visitors
- **Multilingual Support**: English and German localization
- **Digital Menu**: Browse categorized menu items with search and filtering
- **Online Ordering**: Add to cart, customize orders, and checkout with multiple payment options (Stripe, PayPal, Google Pay, Cash)
- **Reservation System**: Book tables online and manage reservations
- **Special Offers**: View current and upcoming restaurant offers
- **Order Tracking**: Real-time order status updates
- **Chatbot Assistant**: Restaurant chatbot for FAQs, order help, and quick actions
- **Customer Reviews**: Display testimonials and feedback
- **Contact Form**: Send messages directly to the restaurant
- **Responsive Design**: Optimized for desktop and mobile
- **Admin APIs**: For managing menu, orders, reservations, and more

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS, MUI, Framer Motion
- **State Management**: Redux Toolkit
- **Internationalization**: next-intl
- **Backend**: Next.js API routes (App Router), Node.js
- **Database**: MongoDB (via Mongoose)
- **Payments**: Stripe, PayPal, Google Pay
- **Email**: Nodemailer (SMTP)
- **Maps**: React-Leaflet, Google Maps API
- **Other**: Firebase, JWT, Vercel Analytics

## Getting Started (Local Development)

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd IndianTadka
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
yarn install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env.local` and fill in required values (MongoDB URI, Stripe/PayPal keys, SMTP, etc.)

4. **Run the development server:**
   ```bash
   npm run dev
   # or
yarn dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

This project is production-ready and can be deployed on [Vercel](https://vercel.com/) for optimal performance and scalability.

- **Vercel**: Push your repository to GitHub and import it into Vercel. Set environment variables in the Vercel dashboard.
- **Custom Hosting**: You can also deploy on your own Node.js server. Build with `npm run build` and start with `npm start`.

## Folder Structure (Highlights)

- `app/` – Next.js app directory (pages, API routes, localization)
- `components/` – UI and client components
- `lib/` – Database models, API utilities, and services
- `store/` – Redux store and slices
- `public/` – Static assets
- `i18n/` – Localization files

## License

This project is proprietary and developed for Indian Tadka Restaurant.

---

For questions or support, contact: [contact@indiantadka.eu](mailto:contact@indiantadka.eu)
