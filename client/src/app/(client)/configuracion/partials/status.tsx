"use client"

import { Badge } from "@/components/ui/badge"
import { useConnectionDatabase } from "@/providers/connection"

export default function DatabaseStatus() {
    const { status } = useConnectionDatabase()

    return (
        <Badge variant={`${
            status == "disconnected" ? "destructive" : "outline"
        }`}>{status}</Badge>
    )
}