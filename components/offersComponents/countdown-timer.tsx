"use client"

import { useState, useEffect } from "react"
import { Box, Typography } from "@mui/material"

interface CountdownTimerProps {
  endDate: string
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function CountdownTimer({ endDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const end = new Date(endDate).getTime()
      const difference = end - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [endDate])

  return (
    <Box className="flex justify-center gap-4 md:gap-6">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <Box key={unit} className="text-center">
          <Box className="bg-white bg-opacity-20 rounded-lg p-2 md:p-3 min-w-[60px] md:min-w-[80px]">
            <Typography variant="h4" className="font-bold text-xl md:text-2xl">
              {value.toString().padStart(2, "0")}
            </Typography>
          </Box>
          <Typography variant="caption" className="text-xs md:text-sm mt-1 capitalize opacity-80">
            {unit}
          </Typography>
        </Box>
      ))}
    </Box>
  )
}
