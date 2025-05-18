'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { MenuCategory } from '@/lib/types/menu_category'
import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { FilterList } from '@mui/icons-material'
import {
    Dialog,
    IconButton,

} from '@mui/material'

interface CategoryTabsProps {
    categories: MenuCategory[]
}

export default function CategoryTabs({ categories }: CategoryTabsProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [selected, setSelected] = useState<string | null>(null)
    const scrollRef = useRef<HTMLDivElement>(null)
    const [showLeftArrow, setShowLeftArrow] = useState(false)
    const [showRightArrow, setShowRightArrow] = useState(true)
    const [filterOpen, setFilterOpen] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    useEffect(() => {
        const handleScroll = () => {
            for (const category of categories) {
                const el = document.getElementById(`category-${category.id}`);
                if (!el) continue;

                const rect = el.getBoundingClientRect();
                const triggerPoint = window.innerHeight * 0.3; // 30% from the top of the screen

                // Check if the top of the element is above the trigger point and its bottom is below it
                if (rect.top <= triggerPoint && rect.bottom > triggerPoint) {
                    if (selected !== category.id) {
                        setSelected(category.id);

                        const params = new URLSearchParams(searchParams.toString());
                        params.set('category', category.id);
                        router.replace(`/menu-list?${params.toString()}`, { scroll: false });
                    }
                    break;
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // run once initially

        return () => window.removeEventListener('scroll', handleScroll);
    }, [categories, selected, searchParams, router]);


    const handleClick = (categoryId: string) => {
        setSelected(categoryId);

        const element = document.getElementById(`category-${categoryId}`);
        if (element) {
            const yOffset = -window.innerHeight * 0.3; // same 30% offset logic
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

            window.scrollTo({ top: y, behavior: 'smooth' });
        }

        // Optional: update the URL
        const params = new URLSearchParams(searchParams.toString());
        params.set('category', categoryId);
        router.push(`/menu-list?${params.toString()}`);
    };


    const scrollLeft = () => {
        scrollRef.current?.scrollBy({ left: -200, behavior: 'smooth' })
    }

    const scrollRight = () => {
        scrollRef.current?.scrollBy({ left: 200, behavior: 'smooth' })
    }

    const updateArrowVisibility = () => {
        const el = scrollRef.current
        if (!el) return

        setShowLeftArrow(el.scrollLeft > 0)
        setShowRightArrow(el.scrollLeft + el.clientWidth < el.scrollWidth - 1)
    }

    useEffect(() => {
        const el = scrollRef.current
        updateArrowVisibility()
        if (!el) return

        el.addEventListener('scroll', updateArrowVisibility)
        return () => el.removeEventListener('scroll', updateArrowVisibility)
    }, [])

    return (
        <div className="flex items-start gap-2 w-[100%] relative">
            {showLeftArrow && (
                <button
                    onClick={scrollLeft}
                    className="absolute left-2 z-10 bg-white px-1"
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>
            )}

            <div className="flex-1 mx-6 overflow-hidden">
                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto gap-3 scroll-smooth scrollbar-hide px-2"
                >
                    {categories.map((c) => (
                        <button
                            key={c.id}
                            onClick={() => handleClick(c.id)}
                            className={`px-4 py-1 rounded-full whitespace-nowrap text-sm font-medium transition-colors duration-200
                            ${selected === c.id
                                    ? 'bg-[#FF6347] text-white'
                                    : 'hover:bg-gray-100 text-gray-800'
                                }`}
                        >
                            {c.categoryName}
                        </button>
                    ))}
                </div>
            </div>

            {showRightArrow && (
                <button
                    onClick={scrollRight}
                    className="absolute right-12 z-10 bg-white px-1"
                >
                    <ChevronRight className="h-5 w-5" />
                </button>
            )}

            {/* Filter Icon */}
            <IconButton
                onClick={() => setFilterOpen(true)}
                className="ml-2 z-10 bg-white"
                aria-label="filter"
            >
                <FilterList />
            </IconButton>

            {/* Filter Dialog */}

            <Dialog
                open={filterOpen}
                onClose={() => setFilterOpen(false)}
                PaperProps={{
                    sx: {
                        width: '35%',
                        maxWidth: 'none', // to prevent MUI's default maxWidth from constraining it
                    },
                }}
            >
                <div className="p-4 min-w-[300px] relative">
                    {/* Close icon in top-right */}
                    <button
                        onClick={() => setFilterOpen(false)}
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                        aria-label="Close"
                    >
                        ✕
                    </button>

                    <h2 className="text-xl font-bold mb-4">Catgories</h2>

                    <ul className="flex flex-col">
                        {categories.sort((a, b) => a.order - b.order).map((category, index) => (
                            <li
                                key={category.id}
                                onClick={() => {
                                    setSelected(category.id)
                                    setSelectedCategory(category.id)
                                    setFilterOpen(false)

                                    const element = document.getElementById(`category-${category.id}`)
                                    if (element) {
                                        const yOffset = -window.innerHeight * 0.3; // same 30% offset logic
                                        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

                                        window.scrollTo({ top: y, behavior: 'smooth' });
                                    }

                                    const params = new URLSearchParams(searchParams.toString())
                                    params.set('category', category.id)
                                    router.push(`/menu-list?${params.toString()}`)
                                }}
                                className={`cursor-pointer px-4 py-3 transition-colors ${selectedCategory === category.id
                                    ? 'bg-[#FF6347] text-white'
                                    : 'hover:bg-gray-100 text-gray-800'
                                    } ${index < categories.length - 1 ? 'border-b border-gray-200' : ''}`}
                            >
                                {category.categoryName}
                            </li>
                        ))}
                    </ul>

                </div>
            </Dialog>
        </div>
    )
}
