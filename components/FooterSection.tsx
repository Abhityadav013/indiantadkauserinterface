import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"
import { Box, Divider, Typography } from "@mui/material"
import { getTranslations } from "next-intl/server"

export default async function FooterSection() {
  const t = await getTranslations("footer_section")
  return (
    <footer className="bg-[#FF6347] py-4 h-full text-white">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-xl font-bold">Indian Tadka</h3>
            <p className="mb-2 text-sm"> Friedrichstraße 69, 66538 Neunkirchen, Germany</p>
          </div>

          <div>
            <h3 className="mb-4 text-xl font-bold">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/digital-menu" className="hover:underline">
                {t('menu')}
              </Link>
              <Link href="/reservation" className="hover:underline">
                {t('reservation')}
              </Link>
              <Link href="contact-us" className="hover:underline">
                {t('contact_us')}
              </Link>
              <Link href="/about-us" className="hover:underline">
                {t('about')}
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="mb-4 text-xl font-bold">Connect With Us</h3>
            <div className="flex space-x-4">
              <Link href="#" aria-label="Facebook">
                <Facebook className="h-6 w-6 hover:text-[#F2A93B]" />
              </Link>
              <Link href="#" aria-label="Instagram">
                <Instagram className="h-6 w-6 hover:text-[#F2A93B]" />
              </Link>
              <Link href="#" aria-label="Twitter">
                <Twitter className="h-6 w-6 hover:text-[#F2A93B]" />
              </Link>
            </div>
          </div>
        </div>
        <Divider sx={{marginTop: '1rem',background:'white'}}/>
        <Box
            component="footer"
            sx={{
                fontWeight: 'bold',
                marginTop: '1.5rem',
                // mt: theme => theme.spacing(3),
                // mb: theme => theme.spacing(2),
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Typography variant="h6" sx={{ fontSize: '0.875rem' }}>
                Copyright {new Date().getFullYear()} © IndianTadka.com - All Rights Reserved
            </Typography>
        </Box>
        {/* <div className="mt-8 border-t border-white/20 pt-8 text-center">
          <p>© {new Date().getFullYear()} Indian Tadka. All rights reserved.</p>
        </div> */}
      </div>
    </footer>
  )
}
