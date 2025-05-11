// This is a SERVER component
import CartPageLoading from '@/components/ClientComponents/CartPageLoading'
import type { ReactNode } from 'react'

export default function CartLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      {/* You can also include a NavBar here if it's common to all cart sub-pages */}
      <CartPageLoading />
      {children}
    </div>
  )
}
