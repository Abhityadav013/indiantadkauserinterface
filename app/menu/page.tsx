// import MenuGrid from "@/components/ClientComponents/MenuGrid";
import MenuGrid from "@/components/ClientComponents/MenuGrid";
import NavBarNavigation from "@/components/NavBarNavigation";
import { menuTransform } from "@/hooks/useMenuTransform";
import { fetchFromApi } from "@/lib/fetchAPICalls";
import { MenuCategory } from "@/lib/types/menu_category";
import { MenuCategoryItem, MenuItem } from "@/lib/types/menu_type";

export async function getMenuData() {
  try {
    const [menuItemsRaw, categoryData] = await Promise.all([
      fetchFromApi<{ menu: MenuItem[] }>(`/menu`),
      fetchFromApi<{ category: MenuCategory[] }>(`/category`),
    ]);
    const menuItems: MenuItem[] = menuItemsRaw.menu;
    const menuCategoriesDetails: MenuCategoryItem[] = categoryData.category
      .map((cat) => ({
        categoryId: cat.id,
        categoryName: cat.categoryName,
        categoryImage: cat.imageUrl,
      }));

    return { menuItems, menuCategoriesDetails };
  } catch (error) {
    console.error("Error fetching menu data:", error);
    return { menuItems: [], menuCategoriesDetails: [] };
  }
}
export default async function MenuPage() {
  const { menuItems, menuCategoriesDetails } = await getMenuData();
  const menuCategories = menuTransform(menuItems, menuCategoriesDetails);
  return (
    <>
      <NavBarNavigation label="Our Menu" isImage={false} />
      <div className=" container mx-auto px-4 py-8 min-h-[100vh] max-h-[1400vh] bg-white">
        <MenuGrid menuCategories={menuCategories} />
      </div>
    </>
  )
}
