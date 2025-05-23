import BasketSidebar from '@/components/ClientComponents/BasketSidebar';
import AddToCartButton from '@/components/ClientComponents/AddToCart';
// import CategoryTabs from '@/components/ClientComponents/CategoryFilter';
import SearchBar from '@/components/ClientComponents/SearchBar';
import NavBarNavigation from '@/components/NavBarNavigation';
import { Box, Divider } from '@mui/material';
import Image from 'next/image';
import TruncatedDescription from '@/components/ClientComponents/TruncatedDescription';
import FooterCopyRights from '@/components/FooterCopyRight';
import { getMenuData } from '@/lib/api/fetchMenuDataApi';
import { formatPrice } from '@/utils/valueInEuros';

type SearchParams = {
  category?: string;
  q?: string;
};


export default async function MenuPage(props: { searchParams?: Promise<SearchParams> }) {
  const searchParams = props.searchParams ? await props.searchParams : undefined;
  const category = searchParams?.category;
  const q = searchParams?.q;
    const { menuItems, menuCategoriesDetails } = await getMenuData();

    let filtered = menuItems;
    if (category) filtered = filtered.filter(item => item.category.id === category);
    if (q) filtered = filtered.filter(item => item.name.toLowerCase().includes(q.toLowerCase()));

    const groupedMenu = menuCategoriesDetails.map(cat => ({
        category: cat,
        items: menuItems.filter(item => item.category.id === cat.id),
    }));

    return (

        <>
            <Box sx={{ display: 'flex', width: '100%', backgroundColor: 'white' }}>
                {/* Left Content: Menu and Filters */}
                <Box sx={{ flex: 1, pl: 2, maxWidth: 'calc(100% - 460px)' }}>
                    <NavBarNavigation label="Our Menu" isImage={false} />
                    <div className="sticky top-14 z-10 bg-white shadow">
                        <SearchBar />
                        {/* <CategoryTabs categories={menuCategoriesDetails} /> */}
                    </div>

                    {filtered.length === 0 ? (
                        <p className="mt-4">No items found for your search.</p>
                    ) : (
                        <Box sx={{ mt: 6, width: '90%' }}>
                            {groupedMenu.map(({ category, items }) => (
                                <Box key={category.id} id={`category-${category.id}`} className="mb-6">
                                    <Divider sx={{ mb: 1, borderBottomWidth: '1.5px' }} />
                                    <h2 className="text-2xl font-bold text-gray-800 mb-4">{category.categoryName}</h2>
                                    {items.map(item => (
                                        <div key={item.id} className="flex p-4 mb-4 border-none rounded-lg shadow-sm max-h-[180px]">
                                            <div className="w-36 h-36 relative rounded-md overflow-hidden flex-shrink-0">
                                                <Image
                                                    src={item.imageURL || "/placeholder.svg"}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex flex-col justify-between flex-grow pl-4">
                                                <div className="flex justify-between items-start">
                                                    <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                                                    <span className="text-lg font-bold text-[#FF6347]">{formatPrice(Number(item.price.toFixed(2)))}</span>
                                                </div>
                                                <TruncatedDescription
                                                    name={item.name}
                                                    price={item.price}
                                                    description={item.description}
                                                    imageUrl={item.imageURL}
                                                />
                                                <div className="flex justify-end">
                                                    <AddToCartButton item={item} />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </Box>
                            ))}
                        </Box>
                    )}
                </Box>

                {/* Right: Basket Sidebar */}
                <BasketSidebar menu={menuItems} />
            </Box>
            <FooterCopyRights /></>
    );
}
