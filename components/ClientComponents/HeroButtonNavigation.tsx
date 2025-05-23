'use client'
import React from 'react'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'

const HeroButtonNavigation = () => {
  const route = useRouter()
  const handleReserveTable = () => {
    // Logic to reserve a table goes here
    route.push("/reservation")
  }
  const handleOrderOnline = () => {
    // Logic to see the menu goes here
    route.push("/menu-list")
  }
  const handleDigitalMenu = () => {
    route.push("/digital-menu")
  }
  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
      <Button size="lg" onClick={handleReserveTable} className="bg-amber-500 text-white hover:bg-amber-600">
        Reserve Table
      </Button>
      <Button onClick={handleOrderOnline} size="lg" className="bg-orange-500 text-white hover:bg-[#FF6347]">
        Order Online
      </Button>
      <Button variant="outline" onClick={handleDigitalMenu} size="lg" className="border-white text-white hover:bg-white/10">
        Digital Menu
      </Button>
    </div>
  )
}

export default HeroButtonNavigation
