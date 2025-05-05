import { MenuItem } from '@/lib/types/menu_type';

type GroupedMenu = {
  [categoryName: string]: MenuItem[];
};

export const useMenuItemsByCategory = (menuItems: MenuItem[]): GroupedMenu => {
  return menuItems.reduce((acc, item) => {
    const category = item.category; // or item.categoryName
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as GroupedMenu);
}
