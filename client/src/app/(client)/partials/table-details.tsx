"use client"
import { useTablesDB } from "./tables.context";

export default function TableDetails() {
    const data = useTablesDB()

    if (!data.currentTable) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <p>Selecciona una tabla</p>
            </div>
        )
    }

    return (
        <div className="w-full h-full flex items-center justify-center">
            <p>{data.currentTable.name}</p>
        </div>
    )

}