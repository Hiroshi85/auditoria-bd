"use client"

import { Button } from "@/components/ui/button"
import { useTablesDB } from "./tables.context"
import { cn } from "@/lib/utils"
import { TableIcon } from "lucide-react"

export default function TableElement({
    table
}:{
    table: string
}) {
    const data = useTablesDB()

    return (
        <Button onClick={() => {
            data.setTable(table)
        }} type="button" className={cn("w-full text-left flex justify-start truncate", data.currentTable != table && "hover:bg-black/5")} size={"sm"} variant={data.currentTable == table ? "default" : "ghost"}>
            <TableIcon className="w-5 h-5 min-w-5 min-h-5 mr-2" />
            {table}
        </Button>
    )
}

