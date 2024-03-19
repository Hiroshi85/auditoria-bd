"use client"

import { buttonVariants } from "@/components/ui/button"
import { NAV_ROUTES } from "@/constants/routes"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function NavRoutes() {
    const pathname = usePathname()

    return (
        <div className="flex gap-2">
            {
                NAV_ROUTES.map((route, index) => {
                    return (
                        <Link key={`${index}-${route.href}`} href={route.href} className={cn(buttonVariants({
                            variant: pathname === route.href ? "default" : "ghost",
                        }))}>
                            <route.icon className={cn("w-4 h-4 mr-1")} />
                            {route.label}
                        </Link>
                    )
                })
            }
        </div>
    )

}