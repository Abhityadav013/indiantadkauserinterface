// FILE: app/menu-list/page.tsx
import { getMenuData } from '@/lib/api/fetchMenuDataApi';
import { getCartData } from '@/lib/api/fetchCartDataApi';
import MenuContent from '@/components/MenuContent';

type SearchParams = {
    category?: string;
    q?: string;
};

export default async function MenuPage({ searchParams }: { searchParams?: Promise<SearchParams> }) {
    const resolvedParams = searchParams ? await searchParams : undefined;
    const category = resolvedParams?.category;
    const q = resolvedParams?.q;

    const { menuItems, menuCategoriesDetails } = await getMenuData();
    const cartItems = await getCartData();


    let groupedMenu;
    let filtered = menuItems;

    if (q) {
        // If query present, filter only by name (ignore category)
        filtered = filtered.filter(item => item.name.toLowerCase().includes(q.toLowerCase()));
    } else if (category) {
        // If no query but category present, filter by category
        filtered = filtered.filter(item => item.category.id === category);
    }
    if (q) {
        // Get unique categories present in the filtered items
        const filteredCategoryIds = Array.from(new Set(filtered.map(item => item.category.id)));

        groupedMenu = filteredCategoryIds.map(catId => {
            // find category details for this id
            const categoryDetail = menuCategoriesDetails.find(cat => cat.id === catId);
            return {
                category: categoryDetail!,
                items: filtered.filter(item => item.category.id === catId),
            };
        });
    } else {
        // No search query: group all menuItems by all categories as usual
        groupedMenu = menuCategoriesDetails.map(cat => ({
            category: cat,
            items: menuItems.filter(item => item.category.id === cat.id),
        }));
    }

    return (
        <MenuContent
            groupedMenu={groupedMenu}
            filtered={filtered}
            menuItems={menuItems}
            cartItems={cartItems}
            categories={menuCategoriesDetails}
        />
    );
}
