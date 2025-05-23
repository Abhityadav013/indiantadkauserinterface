// lib/menuData.ts
import { fetchFromApi } from '@/lib/fetchAPICalls';
import { MenuItem } from '@/lib/types/menu_type';
import { MenuCategory } from '@/lib/types/menu_category';

export async function getMenuData() {
    try {
        const [menuItemsRaw, categoryData] = await Promise.all([
            fetchFromApi<{ menu: MenuItem[] }>(`/menu`,true),
            fetchFromApi<{ category: MenuCategory[] }>(`/category`,true),
        ]);
        const menuItems: MenuItem[] = menuItemsRaw.menu;
        const menuCategoriesDetails: MenuCategory[] = categoryData.category;
        return { menuItems, menuCategoriesDetails };
    } catch (error) {
        console.error("Error fetching menu data:", error);
        return { menuItems: [], menuCategoriesDetails: [] };
    }
}
