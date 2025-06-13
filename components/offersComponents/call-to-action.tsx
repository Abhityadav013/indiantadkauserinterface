'use client'
import { Container, Box, Typography, Button } from "@mui/material"
import { Menu, Calendar } from "lucide-react"
import { useRouter } from "next/navigation"

export default function CallToAction() {
    const router = useRouter();

    const handleNavigate = (path: string) => {
        router.push(path);
    }
    return (
        <Box className="bg-gray-900 text-white py-16">
            <Container maxWidth="lg">
                <Box className="text-center">
                    <Typography variant="h3" className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                        Ready to Experience Authentic Indian Flavors?
                    </Typography>

                    <Typography variant="h6" className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                        Don&apos;t miss out on these amazing deals. Explore our full menu or make a reservation today!
                    </Typography>

                    <Box className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<Menu className="w-5 h-5" />}
                            onClick={() => handleNavigate('/digital-menu')}
                            className="!px-6 !md:px-8 !py-3 !text-sm !md:text-base !bg-orange-600 !text-white !font-semibold !rounded-lg hover:!bg-orange-700 transition-colors"
                        //   className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3"
                        >
                            View Full Menu
                        </Button>

                        <Button
                            variant="outlined"
                            size="large"
                            startIcon={<Calendar className="w-5 h-5" />}
                            onClick={() => handleNavigate('/reservation')}
                            className="!px-6 !md:px-8 !py-3 !text-sm !md:text-base !border-white !text-white !font-semibold !rounded-lg hover:!bg-white hover:!text-gray-900 transition-colors"
                        >
                            Make Reservation
                        </Button>
                    </Box>
                </Box>
            </Container>
        </Box>
    )
}
