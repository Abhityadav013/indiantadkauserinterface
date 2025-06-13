import Image from "next/image";
import { RocketIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function OffersComingSoon() {
  const t = await getTranslations("offers");

  return (
    <main className="flex flex-col md:flex-row items-center justify-center min-h-[calc(100vh-80px)] px-4 pt-18 md:pt-6 pb-12 gap-10">
      {/* Text Section */}
      <div className="flex-1 text-center md:text-left max-w-lg">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-red-600 flex items-center justify-center md:justify-start gap-2">
          <RocketIcon className="w-7 h-7 sm:w-8 sm:h-8 text-red-500" />
          {t("label")}
        </h1>
        <p className="text-base sm:text-lg text-gray-700 mb-4">
          {t("content_one")}
        </p>
      </div>

      {/* GIF Section */}
      <div className="flex-1 flex justify-center max-w-md">
        <Image
          src="https://testing.indiantadka.eu/assets/coming-soon.gif"
          alt="Coming Soon Rocket"
          width={400}
          height={400}
          className="object-contain w-full h-auto"
          priority
        />
      </div>
    </main>
  );
}
