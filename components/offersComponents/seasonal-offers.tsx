import { Container, Box, Typography, Chip } from "@mui/material"
import CountdownTimer from "./countdown-timer"

interface SeasonalOffer {
  title: string
  description: string
  endDate: string
  discount: string
}

interface SeasonalOffersProps {
  offer: SeasonalOffer
}

export default function SeasonalOffers({ offer }: SeasonalOffersProps) {
  return (
    <Container maxWidth="lg" className="py-8">
      <Box className="bg-gradient-to-r from-red-600 to-green-600 rounded-lg p-6 md:p-8 text-white text-center relative overflow-hidden">
        <Box className="absolute inset-0 bg-black bg-opacity-20" />
        <Box className="relative z-10">
          <Chip label="LIMITED TIME" className="bg-yellow-400 text-yellow-900 font-bold mb-4" size="small" />

          <Typography variant="h3" className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
            {offer.title}
          </Typography>

          <Typography variant="h6" className="text-lg md:text-xl mb-6 opacity-90">
            {offer.description}
          </Typography>

          <Box className="flex justify-center mb-4">
            <Chip
              label={`${offer.discount} OFF`}
              className="bg-white text-red-600 font-bold text-lg px-4 py-2"
              size="medium"
            />
          </Box>

          <CountdownTimer endDate={offer.endDate} />
        </Box>
      </Box>
    </Container>
  )
}
