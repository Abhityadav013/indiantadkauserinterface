import { Box, Divider } from "@mui/material";
import NavBarNavigation from "./NavBarNavigation";
import Image from "next/image";
import { formatPrice } from "@/utils/valueInEuros";
import TruncatedDescription from "./ClientComponents/TruncatedDescription";
import AddToCartButton from "./ClientComponents/AddToCart";
import BasketSidebar from "./ClientComponents/BasketSidebar";
// import BasketToggle from "./ClientComponents/BasketToggle";
import FooterCopyRights from "./FooterCopyRight";
import { MenuCategory } from "@/lib/types/menu_category";
import { MenuItem } from "@/lib/types/menu_type";
import { Cart } from "@/lib/types/cart_type";
// import SearchBar from "./ClientComponents/SearchBar";
import CategoryTabs from "./ClientComponents/CategoryFilter";
import ViewCartFooter from "./ViewCartFooter";
import SearchBar from "./ClientComponents/SearchBar";
import { OrderType } from "@/lib/types/order_type";
import BasketToggle from "./ClientComponents/BasketToggle";
import { Suspense } from "react";
import SkeletonSidebar from "./Skeletons/SkeletonSidebar";

interface MenuContentProps {
    groupedMenu: {
        category: MenuCategory;
        items: MenuItem[];
    }[],
    filtered: MenuItem[],
    menuItems: MenuItem[],
    cartItems: Cart[],
    categories: MenuCategory[];
    orderType: OrderType;
}
export default function MenuContent({ groupedMenu, filtered, menuItems, cartItems, categories, orderType }: MenuContentProps) {
    return (
        <>
            <div className="flex w-full bg-white flex-col md:flex-row">

                {/* Left Content */}
                <Box component="section" sx={{ flex: 1, pl: { xs: 1, sm: 1, md: 2 }, pr: { xs: 1, sm: 1, md: 2 }, maxWidth: { md: 'calc(100% - 460px)' } }}>
                    <NavBarNavigation label="Our Menu" redirect_url="/" isImage={false} />
                    <div className="sticky top-17 xs:top-14 z-10 w-[100%] bg-white">
                        <Box
                            component="div"
                            display={{ xs: 'flex', sm: 'flex', md: 'none' }}
                            justifyContent="center"
                            p={3}
                            sx={{ mt: { xs: 7, sm: 7, lg: 14 } }}
                        >
                            <BasketToggle orderType={orderType} />
                        </Box>
                        <SearchBar />
                        <CategoryTabs categories={categories} />
                    </div>

                    {filtered.length === 0 ? (
                        <p className="mt-4">No items found for your search.</p>
                    ) : (
                        <Box component="section" sx={{ mt: { xs: 4, sm: 4, md: 8, lg: 8 } }}>
                            {groupedMenu.map(({ category, items }) => (
                                <Box key={category.id} id={`category-${category.id}`} className="mb-6">
                                    <Divider sx={{ mb: 1, borderBottomWidth: '1.5px' }} />
                                    <h2 className="text-2xl font-bold p-2 text-gray-800 mb-4">{category.categoryName}</h2>

                                    <Box component="div" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        {items.map((item, index) => (
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
                                                <Box
                                                    component="div"
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
                                                        sizes="(max-width: 768px) 100px, 200px"
                                                        priority={index === 0}
                                                    />
                                                </Box>

                                                {/* Right Content */}
                                                <Box
                                                    component="div"
                                                    sx={{
                                                        flexGrow: 1,
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        justifyContent: 'space-between',
                                                        minWidth: 0, // allows text to truncate correctly
                                                    }}
                                                >
                                                    {/* Name and Price */}
                                                    <Box
                                                        component="header"
                                                        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
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
                                                        // name={item.name}
                                                        // price={item.price}
                                                        description={item.description}
                                                    //imageUrl={item.imageURL}
                                                    />

                                                    {/* Add button aligned to bottom right */}
                                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
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
                <Suspense fallback={<SkeletonSidebar />}>
                    <BasketSidebar menu={menuItems} cartItems={cartItems} orderType={orderType} />
                </Suspense>
                <ViewCartFooter itmesCount={cartItems.length ?? 0} menuItems={menuItems} />
            </div>
            <FooterCopyRights />
        </>
    );
}
