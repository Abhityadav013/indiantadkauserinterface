'use server'
import { IMenuTransformed } from '@/lib/interface/IMenuTransform'
import { Box } from '@mui/material';
import React from 'react'
// import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import Image from 'next/image';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';
interface MenuListProps {
    menuCategoriesDetails: Record<string, IMenuTransformed>,
}

export default async function MenuList({ menuCategoriesDetails }: MenuListProps) {
    return (
        <Box sx={{
            mt:'10%',
            display: { xs: 'none', sm: 'block' }  // Hides for mobile, shows for sm and above
        }}> {Object.entries(menuCategoriesDetails).map(([categoryId, categoryData]) => {
            //  const { isExpandable } = categoryData;

            return (
                <div key={categoryId} className="mb-6 border-0 rounded">
                    {/* Category Header */}
                    <div
                        className="flex items-center justify-between px-4 py-2 cursor-pointer bg-gray-100"
                    >
                        <h2 className="text-base font-semibold">{categoryData.categoryName}</h2>
                        {/* <motion.div animate={{ rotate: isExpandable ? 180 : 0 }} transition={{ duration: 0.2 }}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </motion.div> */}
                    </div>

                    {/* Expandable Content */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-2 sm:px-0">
                        {categoryData.items.map((item) => {
                            //   const quantity = getItemQuantity(item.id);
                            return (
                                <Card key={item.id} className="overflow-hidden transition-all border-none rounded-none mt-3 py-0">
                                    <div className="flex flex-col h-full">
                                        <div className="relative h-[140px] w-full overflow-hidden">
                                            <Image
                                                src={item.imageURL || "/placeholder.svg"}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>

                                        <CardContent className="p-4 flex-1 flex flex-col">
                                            <div className="mb-2 flex items-start justify-between">
                                                <h3 className="font-bold">{item.name}</h3>
                                                <span className="ml-2 text-lg font-bold text-[#FF6347]">
                                                    €{item.price.toFixed(2)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                                        </CardContent>

                                        <CardFooter className="flex justify-end p-4 pt-0 mt-auto">
                                            <Button

                                                className="bg-white border rounded-none border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700"
                                                size="sm"
                                            >
                                                <Plus className="mr-1 h-4 w-4" /> Add
                                            </Button>
                                        </CardFooter>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            );
        })}

        </Box>
    )
}

