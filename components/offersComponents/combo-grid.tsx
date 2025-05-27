
'use client'
import { Card, CardContent, CardMedia, Typography, Chip, Box, Button } from "@mui/material"
import { Star } from "lucide-react"

interface Combo {
  id: number
  name: string
  description: string
  price: string
  originalPrice: string
  image: string
  popular: boolean
}

interface ComboGridProps {
  combos: Combo[]
}

export default function ComboGrid({ combos }: ComboGridProps) {

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
  return (
    <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
      {combos.map((combo) => (
        <Card key={combo.id} className="shadow-lg hover:shadow-xl transition-shadow relative">
          {combo.popular && (
            <Chip
              icon={<Star className="w-4 h-4" />}
              label="Popular"
              color="secondary"
              className="absolute top-3 left-3 z-10 bg-orange-500 text-white"
              size="small"
            />
          )}

          <CardMedia component="img" height="200" image={combo.image} alt={combo.name} className="h-48 object-cover" />

          <CardContent className="p-4">
            <Typography variant="h6" className="font-bold text-gray-900 mb-2">
              {combo.name}
            </Typography>

            <Typography variant="body2" className="text-gray-600 mb-3 line-clamp-2">
              {combo.description}
            </Typography>

            <Box className="flex items-center justify-between mb-4">
              <Box className="flex items-center gap-2">
                <Typography variant="h6" className="font-bold text-orange-600">
                  {combo.price}
                </Typography>
                <Typography variant="body2" className="line-through text-gray-500">
                  {combo.originalPrice}
                </Typography>
              </Box>
            </Box>

            <Button variant="contained" onClick={handleOrderOnline} fullWidth className="!bg-orange-500 hover:bg-orange-600 text-white">
              Order Now
            </Button>
          </CardContent>
        </Card>
      ))}
    </Box>
  )
}
