import { CartProvider } from "@/components/ClientComponents/CartContext";
import MenuGrid from "@/components/ClientComponents/MenuGrid";
import NavBarNavigation from "@/components/NavBarNavigation";
import { menu_url } from "@/lib/apiEndpoints";
import { MenuCategory } from "@/lib/types/menu_category";
import { FilteredMenuItem, MenuItem } from "@/lib/types/menu_type";
import { Toaster } from "react-hot-toast";

async function getMenuData() {
  try {
    const [menuResponse, categoryResponse] = await Promise.all([
      fetch(`${menu_url}/menu`, { next: { revalidate: 3600 } }), // Cache for 1 hour
      fetch(`${menu_url}/category`, { next: { revalidate: 3600 } }),
    ]);


    if (!menuResponse.ok || !categoryResponse.ok) {
      throw new Error("Failed to fetch data");
    }

    const foodMenuItems: MenuItem[] = await menuResponse.json();
    const foodCategoryItems: MenuCategory[] = await categoryResponse.json();
    const menuItems: MenuItem[] = foodMenuItems.filter((cat) => cat.isDelivery);
    const menuCategories: FilteredMenuItem[] = foodCategoryItems
      .filter((cat) => cat.isDelivery)
      .map((cat) => ({
        menu_name: cat.categoryName,
        menu_image: cat.imageUrl,
      }));

    return { menuItems, menuCategories };
  } catch (error) {
    console.error("Error fetching menu data:", error);
    return { menuItems: [], menuCategories: [] };
  }
}
export default async function MenuPage() {
  const { menuItems, menuCategories } = await getMenuData();
  return (
    <CartProvider>
      <>
        <NavBarNavigation label="Our Menu" isImage={false} />
        <div className=" container mx-auto px-4 py-8 bg-white">
          <MenuGrid menuItems={menuItems} menuCategories={menuCategories} />
          <Toaster />
        </div>
      </>
    </CartProvider>
  )
}
