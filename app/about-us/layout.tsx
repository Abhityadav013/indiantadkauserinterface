// This is a SERVER component
import type { ReactNode } from 'react'
import NavBarWrapper from '@/components/NavbarWrapper'

export default function AboutUsLayout({ children }: { children: ReactNode }) {
    return (
        <div>
            {/* You can also include a NavBar here if it's common to all cart sub-pages */}
            <NavBarWrapper />
            {children}
        </div>
    )
}