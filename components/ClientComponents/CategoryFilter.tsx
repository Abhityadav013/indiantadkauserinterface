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
import { useSelector } from 'react-redux'
import { RootState } from '@/store'

interface CategoryTabsProps {
    categories: MenuCategory[]
}

export default function CategoryTabs({ categories }: CategoryTabsProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [selected, setSelected] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null)
    const [showLeftArrow, setShowLeftArrow] = useState(false)
    const [showRightArrow, setShowRightArrow] = useState(true)
    const [filterOpen, setFilterOpen] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const isMobile = useSelector((state: RootState) => state.mobile.isMobile)

    // Create a map of refs for each category button
    const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

    useEffect(() => {
        const handleScroll = () => {
            for (const category of categories) {
                const el = document.getElementById(`category-${category.id}`);
                if (!el) continue;

                const rect = el.getBoundingClientRect();
                const triggerPoint = isMobile ? window.innerHeight * 0.25 : window.innerHeight * 0.35;

                if (rect.top <= triggerPoint && rect.bottom > triggerPoint) {
                    if (selected !== category.id) {
                        setSelected(category.id);
                        scrollCategoryButtonIntoView(category.id);

                        const params = new URLSearchParams(searchParams.toString());
                        params.set('category', category.id);
                        router.replace(`/menu-list?${params.toString()}`, { scroll: false });
                    }
                    break;
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, [categories, selected, searchParams, router, isMobile]);

    const scrollCategoryButtonIntoView = (categoryId: string) => {
        const buttonEl = buttonRefs.current[categoryId];
        if (buttonEl) {
            buttonEl.scrollIntoView({
                behavior: 'smooth',
                inline: 'start',
                block: 'nearest',
            });
        }
    }

    const handleClick = (categoryId: string) => {
        setSelected(categoryId);
        scrollCategoryButtonIntoView(categoryId);

        const element = document.getElementById(`category-${categoryId}`);
        if (element) {
            const yOffset = -window.innerHeight * 0.3;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

            window.scrollTo({ top: y, behavior: 'smooth' });
        }

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
        <div className="flex items-start gap-2 mt-4 w-[100%] relative bg-white">
            {showLeftArrow && (
                <button
                    onClick={scrollLeft}
                    className="absolute left-2 top-[15px] -translate-y-1/2 z-10 bg-white px-1 hidden md:block"
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>
            )}

            <div className="flex-1 px-1 mx-0 lg:px-4 lg:mx-5 overflow-hidden">
                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto gap-1 scroll-smooth scrollbar-hide px-2"
                >
                    {categories.map((c) => (
                        <button
                            key={c.id}
                            ref={el => { buttonRefs.current[c.id] = el }}
                            onClick={() => handleClick(c.id)}
                            className={`px-2 py-1 rounded-full whitespace-nowrap text-sm font-medium transition-colors duration-200
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
                    className="absolute right-12 top-[15px] -translate-y-1/2 z-10 bg-white px-1 hidden md:block"
                >
                    <ChevronRight className="h-7 w-5" />
                </button>
            )}

            <IconButton
                onClick={() => setFilterOpen(true)}
                className="ml-2 z-10 bg-white"
                aria-label="filter"
            >
                <FilterList />
            </IconButton>

            <Dialog
                open={filterOpen}
                onClose={() => setFilterOpen(false)}
                PaperProps={{
                    sx: {
                        width: {
                            xs: '90%',   // Mobile
                            sm: '70%',   // Small tablets
                            md: '50%',   // Tablets
                            lg: '35%',   // Laptops and up
                        },
                        maxWidth: 'none',
                        borderRadius: 2,
                        m: 1, // adds margin around for smaller screens
                    },
                }}
            >
                <div className="p-4 relative min-w-[250px] sm:min-w-[300px]">
                    <button
                        onClick={() => setFilterOpen(false)}
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                        aria-label="Close"
                    >
                        ✕
                    </button>

                    <h2 className="text-xl font-bold mb-4">Categories</h2>

                    <ul className="flex flex-col">
                        {categories
                            .sort((a, b) => a.order - b.order)
                            .map((category, index) => (
                                <li
                                    key={category.id}
                                    onClick={() => {
                                        setSelected(category.id);
                                        setSelectedCategory(category.id);
                                        setFilterOpen(false);

                                        scrollCategoryButtonIntoView(category.id);

                                        const element = document.getElementById(`category-${category.id}`);


                                        if (element) {
                                            const rect = element.getBoundingClientRect();
                                            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

                                            let headerOffset = 0;
                                            if (window.innerWidth >= 1024) {
                                                headerOffset = 100; // Desktop
                                            } else if (window.innerWidth >= 640) {
                                                headerOffset = 80; // Tablet
                                            } else {
                                                headerOffset = 75; // Adjusted for mobile
                                            }
                                            const yOffset = -window.innerHeight * 0.15;
                                            const y = rect.top + scrollTop + yOffset - headerOffset;
                                            window.scrollTo({ top: y, behavior: 'smooth' });
                                        }

                                        const params = new URLSearchParams(searchParams.toString());
                                        params.set('category', category.id);
                                        router.push(`/menu-list?${params.toString()}`);
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
