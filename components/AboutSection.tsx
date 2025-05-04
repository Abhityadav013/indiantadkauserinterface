import Image from "next/image"

export default function AboutSection() {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold text-tomato-red sm:text-4xl">About Us</h2>
        <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
          <div className="md:w-1/2">
            <p className="mb-4 text-lg leading-relaxed text-gray-800">
              Welcome to Indian Tadka, where tradition meets innovation. Established in 2024, our restaurant brings the
              authentic flavors of India to your table with a modern twist.
            </p>
            <p className="mb-4 text-lg leading-relaxed text-gray-800">
              Our chefs, with decades of experience in Indian cuisine, carefully select the finest ingredients and
              spices to create dishes that transport you straight to the vibrant streets of India.
            </p>
            <p className="text-lg leading-relaxed text-gray-800">
              At Indian Tadka, we believe food is not just about taste—it&apos;s about creating memories. Join us for an
              unforgettable culinary journey through the diverse regions of India.
            </p>
          </div>
          <div className="relative h-[300px] w-full overflow-hidden rounded-lg md:w-1/2">
            <Image
              src="/placeholder.svg?height=600&width=800"
              alt="Our chef team preparing authentic Indian cuisine"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
