import { BarChart4Icon, FileTextIcon, GlobeIcon, LucideIcon, SettingsIcon } from "lucide-react"

export interface NavRoute {
    label: string
    href: string
    icon: LucideIcon
}

export const NAV_ROUTES: NavRoute[] = [
    {
        label: "Inicio",
        href: "/",
        icon: GlobeIcon
    },
    {
        label: "Resultados",
        href: "/resultados",
        icon: BarChart4Icon
    },
    {
        label: "Configuración",
        href: "/configuracion",
        icon: SettingsIcon
    }
]