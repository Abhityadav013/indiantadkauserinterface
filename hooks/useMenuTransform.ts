import { MenuCategory } from '@/lib/types/menu_category';
import {  MenuItem } from '@/lib/types/menu_type';

export const menuTransform = (menu: MenuItem[], categories: MenuCategory[]) => {
  const transformedMenuItems = menu.reduce(
    (acc, menuItem) => {
      const categoryName = categories.find((cat) => cat.id === menuItem.category.id);

      // Check if the category already exists in the accumulator
      if (!acc[menuItem.category.id]) {
        acc[menuItem.category.id] = {
          items: [],
          categoryName: categoryName?.categoryName ?? '',
          order: menuItem.category.order,
          isExpandable: true//,menuItem.category.order === 1, // Category 1 is expandable by default
        };
      }

      // Push the item into the appropriate category
      acc[menuItem.category.id].items.push(menuItem);

      return acc;
    },
    {} as Record<
      string,
      { items: MenuItem[]; categoryName: string; order: number; isExpandable: boolean }
    >
  );

  return transformedMenuItems;
};
