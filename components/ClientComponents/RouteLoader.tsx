"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { LinearProgress } from "@mui/material";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { endNavigation } from "@/store/slices/navigationSlice";
import { stripLocale } from "@/lib/stripLocale";

export default function RouteLoader() {
    const dispatch = useDispatch();
    const pathname = usePathname();
    const targetPath = useSelector((state: RootState) => state.navigation.targetPath);
    useEffect(() => {
        if (targetPath && pathname) {
            const normalizedPathname = stripLocale(pathname);
            const normalizedTarget = stripLocale(targetPath);
            if (normalizedPathname === normalizedTarget) {
                dispatch(endNavigation());
            }
        }
    }, [pathname, targetPath, dispatch]);

    return targetPath ? (
        <div className="fixed top-0 left-0 w-full z-[9999]">
            <LinearProgress color="primary" />
        </div>
    ) : null;
}
