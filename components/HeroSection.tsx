import HeroButtonNavigation from "./ClientComponents/HeroButtonNavigation"

export default function HeroSection() {
  return (
    <section className="relative h-[80vh] min-h-[500px] w-full">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://testing.indiantadka.eu/assets/header_img.png')",
          filter: "brightness(0.6)",
        }}
      />
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white">
        <h1 className="mb-2 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">Indian Tadka</h1>
        <p className="mb-8 text-xl font-medium sm:text-2xl md:text-3xl">A Place for Complete Indian Cuisine</p>
       <HeroButtonNavigation />
      </div>
    </section>
  )
}
