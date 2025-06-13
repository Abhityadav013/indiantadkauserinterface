'use client'
import React from 'react'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { startNavigation } from '@/store/slices/navigationSlice';
import { useDispatch } from 'react-redux'
const HeroButtonNavigation = () => {
  const dispatch = useDispatch(); // ✅ Redux dispatch hook
  const t = useTranslations('heroSection')
  const route = useRouter()
  const handleReserveTable = () => {
    // Logic to reserve a table goes here
    route.push("/reservation")
  }
  const handleOrderOnline = () => {
    // const phoneNumber = '+4915212628877' // Replace with your actual WhatsApp Business number
    // const message = t('order_message'); // Get localized message from translations
    // const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    // window.open(url, '_blank')
    dispatch(startNavigation('/menu-list'))
    route.push("/menu-list")

  }
  const handleDigitalMenu = () => {
    route.push("/digital-menu")
  }
  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
      <Button size="lg" onClick={handleReserveTable} className="bg-amber-500 text-white hover:bg-amber-600">
        {t('reserve_table')}
      </Button>
      <Button onClick={handleOrderOnline} size="lg" className="bg-orange-500 text-white hover:bg-[#FF6347]">
        {t('order_online')}
      </Button>
      <Button variant="outline" onClick={handleDigitalMenu} size="lg" className="border-white text-white hover:bg-white/10">
        {t('digital_menu')}
      </Button>
    </div>
  )
}

export default HeroButtonNavigation
