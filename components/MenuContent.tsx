import { Box, Divider } from "@mui/material";
import NavBarNavigation from "./NavBarNavigation";
import Image from "next/image";
import { formatPrice } from "@/utils/valueInEuros";
import TruncatedDescription from "./ClientComponents/TruncatedDescription";
import AddToCartButton from "./ClientComponents/AddToCart";
import BasketSidebar from "./ClientComponents/BasketSidebar";
import BasketToggle from "./ClientComponents/BasketToggle";
import FooterCopyRights from "./FooterCopyRight";
import { MenuCategory } from "@/lib/types/menu_category";
import { MenuItem } from "@/lib/types/menu_type";
import { Cart } from "@/lib/types/cart_type";
import SearchBar from "./ClientComponents/SearchBar";
import CategoryTabs from "./ClientComponents/CategoryFilter";

interface MenuContentProps {
    groupedMenu: {
        category: MenuCategory;
        items: MenuItem[];
    }[],
    filtered: MenuItem[],
    menuItems: MenuItem[],
    cartItems: Cart[],
    categories: MenuCategory[];
}
export default function MenuContent({ groupedMenu, filtered, menuItems, cartItems, categories }: MenuContentProps) {
    return (
        <>
            <Box sx={{ display: 'flex', width: '100%', backgroundColor: 'white', flexDirection: { xs: 'column', md: 'row' } }}>
                {/* Left Content */}
                <Box sx={{ flex: 1, pl: { xs: 1, md: 2 }, pr: { xs: 1, md: 2 }, maxWidth: { md: 'calc(100% - 460px)' } }}>
                    <NavBarNavigation label="Our Menu" isImage={false} />

                    <div className="sticky top-12 z-10 w-[100%] bg-white">
                        <Box
                            display={{ xs: 'flex', sm: 'flex', md: 'none' }}
                            justifyContent="center"
                            p={3}
                            sx={{ mt: 14 }}
                        >
                            <BasketToggle />
                        </Box>
                        <SearchBar />
                        <CategoryTabs categories={categories} />
                    </div>

                    {filtered.length === 0 ? (
                        <p className="mt-4">No items found for your search.</p>
                    ) : (
                        <Box sx={{ mt: { xs: 4, sm: 4, md: 8, lg: 8 }, p:2 }}>
                            {groupedMenu.map(({ category, items }) => (
                                <Box key={category.id} id={`category-${category.id}`} className="mb-6">
                                    <Divider sx={{ mb: 1, borderBottomWidth: '1.5px' }} />
                                    <h2 className="text-2xl font-bold text-gray-800 mb-4">{category.categoryName}</h2>

                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        {items.map((item) => (
                                            <Box
                                                key={item.id}
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    alignItems: 'stretch',
                                                    p: 1.5,
                                                    borderRadius: 2,
                                                    boxShadow: 1,
                                                    gap: 1.5,
                                                    width: '100%',
                                                    maxWidth: '100%',
                                                }}
                                            >
                                                {/* Left Image */}
                                                <Box
                                                    sx={{
                                                        width: 100,
                                                        height: 100,
                                                        position: 'relative',
                                                        borderRadius: 2,
                                                        overflow: 'hidden',
                                                        flexShrink: 0,
                                                    }}
                                                >
                                                    <Image
                                                        src={item.imageURL || '/placeholder.svg'}
                                                        alt={item.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </Box>

                                                {/* Right Content */}
                                                <Box
                                                    sx={{
                                                        flexGrow: 1,
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        justifyContent: 'space-between',
                                                        minWidth: 0, // allows text to truncate correctly
                                                    }}
                                                >
                                                    {/* Name and Price */}
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                        <h3
                                                            className="text-sm font-semibold text-gray-900 truncate"
                                                            style={{ maxWidth: '70%' }}
                                                        >
                                                            {item.name}
                                                        </h3>
                                                        <span className="text-sm font-bold text-[#FF6347] whitespace-nowrap">
                                                            {formatPrice(Number(item.price.toFixed(2)))}
                                                        </span>
                                                    </Box>

                                                    {/* Description */}
                                                    <TruncatedDescription
                                                        name={item.name}
                                                        price={item.price}
                                                        description={item.description}
                                                        imageUrl={item.imageURL}
                                                    />

                                                    {/* Add button aligned to bottom right */}
                                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                                                        <AddToCartButton item={item} />
                                                    </Box>
                                                </Box>
                                            </Box>

                                        ))}
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    )}
                </Box>
                <BasketSidebar menu={menuItems} cartItems={cartItems} />
            </Box>
            <FooterCopyRights />
        </>
    );
}
