'use client';
import { MenuItem } from '@/lib/types/menu_type';
import ViewCartFooter from '../ViewCartFooter';

interface ViewCartFooterProps {
    itmesCount: number;
    menuItems: MenuItem[]
}
export default function ViewCartFooterClient(props: ViewCartFooterProps) {
  return <ViewCartFooter {...props} />;
} 