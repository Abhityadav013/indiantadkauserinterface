import React, { RefObject, useState } from 'react';
import { Filter, X } from "lucide-react";
import debounce from "lodash.debounce";

interface SearchFoodCategoryProps {
    showFilter: boolean;
    setShowFilter: React.Dispatch<React.SetStateAction<boolean>>;
    activeCategory: { id: string, name: string } | null;
    setActiveCategory: React.Dispatch<React.SetStateAction<{ id: string, name: string } | null>>;
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
    setIsLoading:React.Dispatch<React.SetStateAction<boolean>>;
    categories: {
        id: string;
        name: string;
    }[];
    hasRef:RefObject<boolean>
}

const SearchFoodCategory: React.FC<SearchFoodCategoryProps> = ({
    categories,
    showFilter,
    activeCategory,
    searchTerm,
    setShowFilter,
    setActiveCategory,
    setSearchTerm,
    setIsLoading,
    hasRef
}) => {
    const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

    // Debounced search handler
    const debouncedSearch = debounce((value: string) => {
        if (activeCategory) {
            // If a category is selected, format the search query as category:[categoryName] + item name
            setSearchTerm(`category: ${activeCategory.name} ${value}`);
        } else {
            // If no category is selected, just search by item name
            setSearchTerm(value);
        }
    }, 100); // Delay search by 1000ms

    // Handle input changes and set local search term immediately
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setLocalSearchTerm(value);
       // debouncedSearch(value); // Call the debounced function
    };

    // Handle category selection
    const handleCategorySelect = (category: { id: string, name: string }) => {
        setActiveCategory(category);
        setLocalSearchTerm(`category: ${category.name} `); // Update local search term with category prefix
        setSearchTerm(`category: ${category.name} `);      // Set search term to category prefix
        setShowFilter(false);
    };

    // Reset search term and local search when the active category is cleared
    const handleClearSearch = () => {
        setActiveCategory(null);
        setSearchTerm('');
        setLocalSearchTerm('');
        setShowFilter(false);
        setIsLoading(false);
        hasRef.current =false
    };

    const handleSearch = () =>{
        console.log('localSearchTerm::::',localSearchTerm)
        hasRef.current =false
        debouncedSearch(localSearchTerm); // Call the debounced function
    }

    return (
        <div className="relative max-w-md mx-auto mt-12 mb-6">
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 shadow-sm">
                <input
                    type="text"
                    placeholder={activeCategory ? `Search within ${activeCategory.name}` : "Search food..."}
                    className="flex-1 bg-transparent focus:outline-none text-sm"
                    value={localSearchTerm} // Bind value to localSearchTerm
                    onChange={handleSearchChange}
                    disabled={activeCategory !== null}  // Disable input if a category is selected
                />
                {(activeCategory || localSearchTerm) && (
                    <button
                        onClick={handleClearSearch}
                        className="ml-2 text-gray-600 hover:text-gray-800"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
                <button
                    onClick={() => setShowFilter(!showFilter)}
                    className="ml-2 text-gray-600 hover:text-gray-800"
                >
                    <Filter className="w-4 h-4" />
                </button>
                <button
                        onClick={handleSearch}
                        className="ml-2 p-2 font-semibold text-sm rounded-full bg-green-600 text-gray-600 hover:text-gray-800"
                    >
                        Search
                    </button>
            </div>

            {/* Dropdown for categories */}
            {showFilter && (
                <div className="absolute top-full left-0 right-0 bg-white shadow-md border mt-2 z-10 rounded-md p-2">
                    <button
                        onClick={() => {
                            setActiveCategory(null);
                            setShowFilter(false);
                        }}
                        className={`block w-full text-left px-3 py-1 text-sm rounded-md hover:bg-gray-100 ${activeCategory === null ? "bg-gray-100 font-medium" : ""}`}
                    >
                        All
                    </button>
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => handleCategorySelect(category)} // Select category and update search
                            className={`block w-full text-left px-3 py-1 text-sm rounded-md hover:bg-gray-100 ${activeCategory && activeCategory.id === category.id ? "bg-gray-100 font-medium" : ""}`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchFoodCategory;
