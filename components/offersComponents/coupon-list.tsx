import { Card, CardContent, Typography, Chip, Box } from "@mui/material"
import CopyButton from "./copy-button"

interface Coupon {
  id: number
  code: string
  description: string
  expiryDate: string
  discount: string
  minOrder: string
}

interface CouponListProps {
  coupons: Coupon[]
}

export default function CouponList({ coupons }: CouponListProps) {
  return (
    <Box className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {coupons.map((coupon) => (
        <Card key={coupon.id} className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <Box className="flex justify-between items-start mb-4">
              <Box>
                <Typography variant="h6" className="font-bold text-gray-900 mb-1">
                  {coupon.code}
                </Typography>
                <Chip
                  label={coupon.discount + " OFF"}
                  color="primary"
                  size="small"
                  className="!bg-orange-600 text-white"
                />
              </Box>
              <CopyButton code={coupon.code} />
            </Box>

            <Typography variant="body1" className="text-gray-700 mb-3">
              {coupon.description}
            </Typography>

            <Box className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-sm text-gray-600">
              <span>Min. order: {coupon.minOrder}</span>
              <span>Expires: {new Date(coupon.expiryDate).toLocaleDateString()}</span>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  )
}
