'use client'

import { useState } from "react"
import { TextField, InputAdornment } from "@mui/material"
import { Search } from "@mui/icons-material"

export default function SearchBar() {
    const [searchTerm, setSearchTerm] = useState("")

    return (
        <div className="flex items-start gap-2 w-[70%] py-6 relative px-5">
            <TextField
                fullWidth
                placeholder="Search your food..."
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search />
                        </InputAdornment>
                    ),
                }}
                // This is what ensures full pill shape
                className="bg-white rounded-full [&_fieldset]:rounded-full"
            />
        </div>
    )
}
