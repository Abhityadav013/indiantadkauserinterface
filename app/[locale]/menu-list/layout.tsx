// This is a SERVER component
import AddressReduxComponent from '@/components/lib/AddressReduxComponent'
import type { ReactNode } from 'react'

export default function MenuListLayout({ children }: { children: ReactNode }) {
    return (
        <div>
            {/* You can also include a NavBar here if it's common to all cart sub-pages */}
            <AddressReduxComponent />
            {children}
        </div>
    )
}