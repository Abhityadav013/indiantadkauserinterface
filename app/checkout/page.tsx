import OrderDetails from '@/components/ClientComponents/OrderDetails';
import NavBarNavigation from '@/components/NavBarNavigation'; // Assuming you have this

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <NavBarNavigation label="Checkout" isImage={false} />

      {/* Flex container for both OrderDetails */}
      <div className="mt-6 flex flex-col lg:flex-row gap-6">
        {/* Left panel */}
        <div className="flex-1">
          <OrderDetails />
        </div>

        {/* Right panel */}
        {/* <div className="flex-1">
          <OrderDetails />
        </div> */}
      </div>
    </main>
  );
}
