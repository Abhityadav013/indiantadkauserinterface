'use client'
import React from 'react'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
const HeroButtonNavigation = () => {
  const t = useTranslations('heroSection')
  const route = useRouter()
  const handleReserveTable = () => {
    // Logic to reserve a table goes here
    route.push("/reservation")
  }
  const handleOrderOnline = () => {
    const phoneNumber = '+4915212628877' // Replace with your actual WhatsApp Business number
    const message = `Hi, I would like to place an order.

👋 Welcome to Indian Tadka!

You can:
📋 View our menu: https://indiantadka.eu/digital-menu
🧑‍🍳 Ask for today’s specials
🚚 Place an order directly here`;


    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }
  const handleDigitalMenu = () => {
    route.push("/digital-menu")
  }
  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
      <Button size="lg" onClick={handleReserveTable} className="bg-amber-500 text-white hover:bg-amber-600">
       {t('reserve_table')} Reserve Table
      </Button>
      <Button onClick={handleOrderOnline} size="lg" className="bg-orange-500 text-white hover:bg-[#FF6347]">
        {t('order_online')} Order Online
      </Button>
      <Button variant="outline" onClick={handleDigitalMenu} size="lg" className="border-white text-white hover:bg-white/10">
        {t('digital_menu')} Digital Menu
      </Button>
    </div>
  )
}

export default HeroButtonNavigation
