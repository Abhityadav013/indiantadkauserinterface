import { Clock, Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { getTranslations } from "next-intl/server"

export default async function HoursSection() {
  const t = await getTranslations("openingTime")
  const hours = [
    { day: t('monday'), time: "Closed (See you Tuesday!)" },
    { day: t('tuesday'), time: "11:45 AM – 2:30 PM, 5:30 PM – 10:00 PM" },
    { day: t('wednesday'), time: "11:45 AM – 2:30 PM, 5:30 PM – 10:00 PM" },
    { day: t('thursday'), time: "11:45 AM – 2:30 PM, 5:30 PM – 10:00 PM" },
    { day: t('friday'), time: "11:45 AM – 2:30 PM, 5:30 PM – 10:00 PM" },
    { day: t('saturday'), time: "Closed in the morning, Open: 5:30 PM – 10:00 PM" },
    { day: t('sunday'), time: "11:45 AM – 2:30 PM, 5:30 PM – 10:00 PM" },
  ]

  return (
    <section className="bg-[#F2A93B] py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 flex items-center justify-center">
          <Clock className="mr-2 h-8 w-8 text-[#FF6347]" />
          <h2 className="text-center text-3xl font-bold text-[#FF6347] sm:text-4xl">{t('opening_hour')}</h2>
        </div>

        <div className="mx-auto max-w-3xl">
          <Card className="border-2 border-[#FF6347]/20 bg-white/90 shadow-lg">
            <CardContent className="p-6">
              <div className="mb-6 flex items-center justify-center gap-2">
                <Calendar className="h-5 w-5 text-[#FF6347]" />
                <h3 className="text-xl font-semibold text-[#FF6347]">{t('weekly_schedule')}</h3>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {hours.map((item) => (
                  <div
                    key={item.day}
                    className="flex flex-col items-center rounded-lg bg-[#FFFDD0] p-4 text-center shadow-sm"
                  >
                    <span className="mb-2 font-bold text-[#FF6347]">{item.day}</span>
                    <span className="text-sm text-gray-700 whitespace-pre-line">{item.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
