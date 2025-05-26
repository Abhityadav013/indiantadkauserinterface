/* eslint-disable react/no-unescaped-entities */
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Leaf, Heart, Users, Award, Globe, Utensils } from "lucide-react"
import Image from "next/image"
import AboutUsFooterNavigation from "@/components/ClientComponents/AboutUsFooterNavigation"
// import AboutUsFooterNavigation from "@/components/ClientComponents/AboutUsFooterNavigation"

export default function AboutUsComponent() {
    return (
      <div className="min-h-screen bg-background mt-16">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6">
              <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-xs md:text-sm">
                Authentic Indian Cuisine in Germany
              </Badge>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Where Tradition Meets Innovation
              </h1>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed px-4 sm:px-0">
                Welcome to our culinary journey that bridges the vibrant flavors of India with the heart of Germany.
                We're more than just a restaurant – we're a cultural experience that celebrates authentic Indian
                traditions while embracing local German ingredients and hospitality.
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
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Our Story</h2>
            <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto px-4 sm:px-0">
              Born from a passion for sharing India's rich culinary heritage with our German community
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="space-y-6">
              <p className="text-gray-700 leading-relaxed">
                Our journey began with a simple dream: to create a space where the aromatic spices of India could find a
                new home in Germany. Founded by a family passionate about authentic Indian cuisine, we've spent years
                perfecting recipes passed down through generations while adapting to local tastes and preferences.
              </p>
              <p className="text-gray-700 leading-relaxed">
                What makes us unique is our commitment to authenticity without compromise. Every dish tells a story of
                India's diverse regions, from the robust flavors of Punjab to the delicate spices of Kerala, all
                prepared with the finest locally sourced German ingredients.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We believe food is a universal language that brings people together. Whether you're an Indian living
                abroad missing the taste of home, or a German local curious about authentic Indian flavors, our doors
                are always open with warm hospitality.
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
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto px-4 sm:px-0">
              The principles that guide everything we do, from sourcing ingredients to serving our guests
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 md:p-8 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Utensils className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">Authentic Flavors</h3>
                <p className="text-gray-600 leading-relaxed">
                  Every spice blend and cooking technique stays true to traditional Indian methods, ensuring authentic
                  taste in every bite.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 md:p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">Local Sourcing</h3>
                <p className="text-gray-600 leading-relaxed">
                  We partner with local German farmers and suppliers to source the freshest ingredients, supporting our
                  community while maintaining quality.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 md:p-8 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">Warm Hospitality</h3>
                <p className="text-gray-600 leading-relaxed">
                  Indian hospitality means treating every guest like family. We create a welcoming atmosphere where
                  everyone feels at home.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 md:p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">Cultural Bridge</h3>
                <p className="text-gray-600 leading-relaxed">
                  We celebrate the beautiful fusion of Indian and German cultures, creating connections through shared
                  meals and experiences.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 md:p-8 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">Excellence</h3>
                <p className="text-gray-600 leading-relaxed">
                  From ingredient selection to final presentation, we maintain the highest standards in every aspect of
                  our culinary craft.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 md:p-8 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">Sustainability</h3>
                <p className="text-gray-600 leading-relaxed">
                  We're committed to environmentally responsible practices, from reducing waste to supporting
                  sustainable farming methods.
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
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">The Complete Experience</h2>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed px-4 sm:px-0">
                Step into our restaurant and embark on a sensory journey through India. Our cozy, thoughtfully designed
                space combines traditional Indian aesthetics with modern German comfort, creating an atmosphere that's
                both exotic and familiar.
              </p>
              <p className="text-gray-700 leading-relaxed">
                From the moment you enter, you'll be greeted by the gentle aroma of freshly ground spices, the warm glow
                of traditional brass lamps, and the genuine smiles of our team. Our menu features both beloved classics
                and innovative fusion dishes that showcase the versatility of Indian cuisine.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Whether you're joining us for a romantic dinner, a family celebration, or a business lunch, we ensure
                every visit is memorable. Our knowledgeable staff is always ready to guide you through our menu,
                recommend wine pairings, or accommodate dietary preferences.
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
    </div>
    )
}
