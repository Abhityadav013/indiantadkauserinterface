// This is a SERVER component
import AddUserAddress from '@/components/AddUserAddress'
import type { ReactNode } from 'react'

export default function CheckOutLayout({ children }: { children: ReactNode }) {
    return (
        <div>
            {/* You can also include a NavBar here if it's common to all cart sub-pages */}
            <AddUserAddress />
            {children}
        </div>
    )
}
