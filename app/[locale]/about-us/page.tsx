import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Leaf, Heart, Users, Award, Globe, Utensils } from "lucide-react"
import Image from "next/image"
import AboutUsFooterNavigation from "@/components/ClientComponents/AboutUsFooterNavigation"
import { getTranslations } from "next-intl/server"
// import AboutUsFooterNavigation from "@/components/ClientComponents/AboutUsFooterNavigation"

export default async function AboutUsComponent() {
  const t = await getTranslations("about_us")
  return (
    <main className="min-h-screen pt-12 md:pt-6 bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6">
              <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-xs md:text-sm">
                {t("section_one.info")}
              </Badge>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                {t("section_one.heading")}
              </h1>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed px-4 sm:px-0">
                {t("section_one.content")}
              </p>
            </div>
            <div className="relative">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Restaurant interior with warm lighting and traditional Indian decor"
                width={600}
                height={400}
                className="rounded-lg shadow-xl object-cover w-full h-auto max-h-80 md:max-h-96 lg:max-h-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{t("section_two.label")}</h2>
            <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto px-4 sm:px-0">
              {t("section_two.sub_heading")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="space-y-6">
              <p className="text-gray-700 leading-relaxed">
                {t("section_two.content_1")}
              </p>
              <p className="text-gray-700 leading-relaxed">
                {t("section_two.content_2")}
              </p>
              <p className="text-gray-700 leading-relaxed">
                {t("section_two.content_3")}
              </p>
            </div>
            <div className="relative">
              <Image
                src="/placeholder.svg?height=400&width=500"
                alt="Traditional Indian spices and ingredients"
                width={500}
                height={400}
                className="rounded-lg shadow-lg object-cover w-full h-auto max-h-80 md:max-h-96"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Chef Section */}
      {/* <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-1">
              <Image
                src="/placeholder.svg?height=400&width=300"
                alt="Head Chef in traditional Indian chef attire"
                width={300}
                height={400}
                className="rounded-lg shadow-lg object-cover mx-auto h-auto w-full max-w-sm lg:max-w-none max-h-96 md:max-h-none"
              />
            </div>
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Meet Our Head Chef</h2>
                <p className="text-lg md:text-xl text-orange-600 font-semibold">
                  Master of Traditional & Modern Indian Cuisine
                </p>
              </div>
              <p className="text-gray-700 leading-relaxed">
                With over 15 years of culinary expertise spanning from Mumbai's bustling street food scene to fine
                dining establishments across Europe, our Head Chef brings an unparalleled depth of knowledge to every
                dish. Trained in classical Indian cooking techniques and certified in European culinary arts, they
                masterfully blend traditional recipes with contemporary presentation.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Their philosophy is simple: respect the authenticity of each spice and ingredient while creating dishes
                that surprise and delight. From hand-ground masalas to innovative fusion creations, every plate reflects
                years of dedication to the craft and a deep understanding of both Indian and German palates.
              </p>
              <div className="flex flex-wrap gap-2 md:gap-3">
                <Badge variant="outline" className="bg-white">
                  15+ Years Experience
                </Badge>
                <Badge variant="outline" className="bg-white">
                  Traditional Techniques
                </Badge>
                <Badge variant="outline" className="bg-white">
                  Modern Innovation
                </Badge>
                <Badge variant="outline" className="bg-white">
                  European Certified
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Values Section */}
      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{t("section_three.label")}</h2>
            <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto px-4 sm:px-0">
              {t("section_three.sub_heading")}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 md:p-8 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Utensils className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">{t("section_three.card_one.heading")}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {t("section_three.card_one.content")}
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 md:p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">{t("section_three.card_two.heading")}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {t("section_three.card_two.content")}
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 md:p-8 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">{t("section_three.card_three.heading")}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {t("section_three.card_three.content")}
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 md:p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">{t("section_three.card_four.heading")}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {t("section_three.card_four.content")}
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 md:p-8 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">{t("section_three.card_five.heading")}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {t("section_three.card_five.content")}
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 md:p-8 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">{t("section_three.card_six.heading")}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {t("section_three.card_six.content")}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">{t("section_four.label")}</h2>
              <p className="text-gray-700 leading-relaxed">
                {t("section_four.content_one")}
              </p>
              <p className="text-gray-700 leading-relaxed">
                {t("section_four.content_two")}
              </p>
              <p className="text-gray-700 leading-relaxed">
                {t("section_four.content_three")}
              </p>
            </div>
            <div className="relative">
              <Image
                src="/placeholder.svg?height=400&width=500"
                alt="Cozy restaurant dining area with traditional Indian decor"
                width={500}
                height={400}
                className="rounded-lg shadow-lg object-cover w-full h-auto max-h-80 md:max-h-96"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      {/* <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">Experience India in the Heart of Germany</h2>
          <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed px-4 sm:px-0">
            Join us for an unforgettable culinary journey where every meal is a celebration of authentic flavors, warm
            hospitality, and cultural connection.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <a
              href="#reservations"
              className="inline-flex items-center justify-center px-6 md:px-8 py-3 text-sm md:text-base bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
            >
              Make a Reservation
            </a>
            <a
              href="#menu"
              className="inline-flex items-center justify-center px-6 md:px-8 py-3 text-sm md:text-base border border-white text-white font-semibold rounded-lg hover:bg-white hover:text-gray-900 transition-colors"
            >
              View Our Menu
            </a>
          </div>
        </div>
      </section> */}
      <AboutUsFooterNavigation />
    </main>
  )
}
