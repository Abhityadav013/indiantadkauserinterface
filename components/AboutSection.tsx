import { getTranslations } from "next-intl/server"
import Image from "next/image"

export default async function AboutSection() {
  const t = await getTranslations("homeAbout")
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold text-tomato-red sm:text-4xl">{t('about')}</h2>
        <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
          <div className="md:w-1/2">
            <p className="mb-4 text-lg leading-relaxed text-gray-800">
              {t('about_text_1')}

            </p>
            <p className="mb-4 text-lg leading-relaxed text-gray-800">
              {t('about_text_2')}

            </p>
            <p className="text-lg leading-relaxed text-gray-800">
              {t('about_text_3')}

            </p>
          </div>
          <div className="relative h-[300px] w-full overflow-hidden rounded-lg md:w-1/2">
            <Image
              src="https://testing.indiantadka.eu/assets/header_img.png"
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
