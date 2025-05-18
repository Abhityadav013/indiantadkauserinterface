// import SearchBar from "./ClientComponents/SearchBar"
// import CategoryFilter from "./ClientComponents/CategoryFilter"
// import { MenuItem } from "@/lib/types/menu_type"
// import { MenuCategory } from "@/lib/types/menu_category"

// interface MenuLayoutProps {
//   menuItems: MenuItem[]
//   categories: MenuCategory[]
// }

// export default function MenuLayout({ menuItems, categories }: MenuLayoutProps) {
//   return (
//      <div className="container mx-auto px-4 py-6 md:py-8">
//         <div className="flex flex-col md:flex-row gap-6">
//           <div className="w-full md:w-8/12">
//             <SearchBar />
//             <CategoryFilter categories={categories} />
//             <MenuItems menuItems={menuItems} categories={categories} />
//           </div>
//           <div className="hidden md:block md:w-4/12">
//             {/* <CartPanel /> */}
//           </div>
//         </div>
//         {/* Mobile Cart Button */}
//         <div className="md:hidden fixed bottom-4 right-4 z-50">
//           {/* <MobileCartButton /> */}
//         </div>
//       </div>
//   )
// }

