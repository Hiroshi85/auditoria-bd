"use client"
import { DataTable } from "@/components/layout/table/table-details";
import { useTablesDB } from "./tables.context";
import { columns } from "./columns";
import { Column } from "@/types/database";
import ExceptionOptions from "./exception-options";

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
                <h3 className="font-bold text-4xl mb-5">Tabla: {data.currentTable}</h3>
                {
                    data.query.isLoading ? (
                        <p>Cargando...</p>
                    ) : (
                        <div className="flex flex-col gap-5">
                            <ExceptionOptions tableName={data.currentTable} />
                            <DataTable columns={columns} data={data.query.data?.columns as Column[]} />
                        </div>
                    )
                }
            </div>
        </div>
    )

}