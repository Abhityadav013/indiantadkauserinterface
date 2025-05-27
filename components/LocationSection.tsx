import { MapPin, Phone, Mail } from "lucide-react"
import RestaurantMap from "./ClientComponents/RestaurantMap"

export default function LocationSection() {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold text-[#FF6347] sm:text-4xl">Find Us</h2>
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="lg:w-1/2">
            <div className="h-[400px] w-full overflow-hidden rounded-lg bg-gray-200">
              <RestaurantMap />
            </div>
          </div>
          <div className="flex flex-col justify-center lg:w-1/2">
            <div className="space-y-6 rounded-lg bg-[#FFFDD0] p-8 shadow-md">
              <h3 className="text-2xl font-bold text-[#FF6347]">Contact Information</h3>

              <div className="flex items-start">
                <MapPin className="mr-4 h-6 w-6 text-[#FF6347]" />
                <div>
                  <h4 className="font-semibold">Address</h4>
                  <p className="text-gray-700">Friedrichstraße 69, </p>
                  <p className="text-gray-700">66538 Neunkirchen, Germany</p>
                </div>
              </div>

              <div className="flex items-start">
                <Phone className="mr-4 h-6 w-6 text-[#FF6347]" />
                <div>
                  <h4 className="font-semibold">Phone</h4>
                  <p className="text-gray-700">
                    <a href="tel:+4915212628877" className="hover:underline">
                      (+49)-1521 2628877
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Mail className="mr-4 h-6 w-6 text-[#FF6347]" />
                <div>
                  <h4 className="font-semibold">Email</h4>
                  <p className="text-gray-700">
                    <a href="mailto:info@indiantadka.com" className="hover:underline">
                      info@indiantadka.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
