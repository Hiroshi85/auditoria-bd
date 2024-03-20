"use client"

import { Button } from "@/components/ui/button"
import { useTablesDB } from "./tables.context"
import { cn } from "@/lib/utils"

export default function TableElement({
    table
}:{
    table: string
}) {
    const data = useTablesDB()

    return (
        <Button onClick={() => {
            data.setTable(table)
        }} className={cn("w-full text-left", data.currentTable?.name != table && "hover:bg-black/5")} size={"sm"} variant={data.currentTable?.name == table ? "default" : "ghost"}>
            {table}
        </Button>
    )
}

