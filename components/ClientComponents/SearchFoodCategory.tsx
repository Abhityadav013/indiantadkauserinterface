import React from 'react'
import { Filter, X } from "lucide-react"
interface SearchFoodCategoryProps {
    showFilter: boolean,
    setShowFilter: React.Dispatch<React.SetStateAction<boolean>>,
    activeCategory: string | null,
    setActiveCategory: React.Dispatch<React.SetStateAction<string | null>>
    searchTerm: string,
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>,
    categories: string[]
}

const SearchFoodCategory: React.FC<SearchFoodCategoryProps> = ({ categories, showFilter, activeCategory, searchTerm, setShowFilter, setActiveCategory, setSearchTerm }) => {
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (activeCategory) {
            // If a category is selected, format the search query as category:[categoryName] + item name
            setSearchTerm(`category: ${activeCategory} ${e.target.value}`);
        } else {
            // If no category is selected, just search by item name
            setSearchTerm(e.target.value);
        }
    };
    return (
        <div className="relative max-w-md mx-auto mt-12 mb-6">
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 shadow-sm">
                <input
                    type="text"
                    placeholder="Search food..."
                    className="flex-1 bg-transparent focus:outline-none text-sm"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    disabled={activeCategory !== null}  // Disable input if a category is selected
                />
                {activeCategory && (
                    <button
                        onClick={() => {
                            setActiveCategory(null)
                            setSearchTerm('');
                            setShowFilter(false)
                        }}
                        className="ml-2 text-gray-600 hover:text-gray-800"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
                <button
                    onClick={() => setShowFilter(!showFilter)}
                    className="ml-2 text-gray-600 hover:text-gray-800"
                >
                    <Filter className="w-4 h-4 b " />
                </button>

            </div>

            {/* Dropdown for categories */}
            {showFilter && (
                <div className="absolute top-full left-0 right-0 bg-white shadow-md border mt-2 z-10 rounded-md p-2">
                    <button
                        onClick={() => {
                            setActiveCategory(null)
                            setShowFilter(false)
                        }}
                        className={`block w-full text-left px-3 py-1 text-sm rounded-md hover:bg-gray-100 ${activeCategory === null ? "bg-gray-100 font-medium" : ""
                            }`}
                    >
                        All
                    </button>
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => {
                                setActiveCategory(category)
                                setSearchTerm(`category: ${category}`);
                                setShowFilter(false)
                            }}
                            className={`block w-full text-left px-3 py-1 text-sm rounded-md hover:bg-gray-100 ${activeCategory === category ? "bg-gray-100 font-medium" : ""
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default SearchFoodCategory
