"use client"
import { DataTable } from "@/components/layout/table/table-details";
import { useTablesDB } from "./tables.context";
import { columns } from "./columns";
import { Column } from "@/types/database";

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
        <div className="w-full h-full px-5">
            <div>
                <h3 className="font-bold text-4xl">Tabla: {data.currentTable}</h3>
                {
                    data.query.isLoading ?  (
                        <p>Cargando...</p>
                    ) : (
                        <DataTable columns={columns} data={data.query.data?.columns as Column[]}/>
                    )
                }
            </div>
        </div>
    )

}