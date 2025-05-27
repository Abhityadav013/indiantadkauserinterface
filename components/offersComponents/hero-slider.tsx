"use client"

import { useState, useEffect } from "react"
import { Box, Typography, IconButton } from "@mui/material"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

interface Slide {
  id: number
  title: string
  subtitle: string
  image: string
  bgColor: string
}

interface HeroSliderProps {
  slides: Slide[]
}

export default function HeroSlider({ slides }: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [slides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <Box className="relative h-64 md:h-96 lg:h-[500px] overflow-hidden">
      {slides.map((slide, index) => (
        <Box
          key={slide.id}
          className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
            index === currentSlide ? "translate-x-0" : index < currentSlide ? "-translate-x-full" : "translate-x-full"
          }`}
        >
          <Box className={`relative h-full bg-gradient-to-r ${slide.bgColor} flex items-center`}>
            <Box className="absolute inset-0 bg-black bg-opacity-30" />
            <Image
              src={slide.image || "/placeholder.svg"}
              alt={slide.title}
              fill
              className="object-cover mix-blend-overlay"
            />
            <Box className="relative z-10 container mx-auto px-4 md:px-6 lg:px-8">
              <Box className="max-w-2xl text-white">
                <Typography variant="h2" component="h1" className="text-3xl md:text-4xl lg:text-6xl font-bold mb-4">
                  {slide.title}
                </Typography>
                <Typography variant="h5" className="text-lg md:text-xl lg:text-2xl opacity-90">
                  {slide.subtitle}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      ))}

      {/* Navigation Arrows */}
      <IconButton
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white z-20"
        size="large"
      >
        <ChevronLeft className="w-6 h-6" />
      </IconButton>

      <IconButton
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white z-20"
        size="large"
      >
        <ChevronRight className="w-6 h-6" />
      </IconButton>

      {/* Dots Indicator */}
      <Box className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? "bg-white" : "bg-white bg-opacity-50"
            }`}
          />
        ))}
      </Box>
    </Box>
  )
}
