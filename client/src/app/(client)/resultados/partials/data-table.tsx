"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    SortingState,
    getSortedRowModel,
    ColumnFiltersState,
    getFilteredRowModel,
    getPaginationRowModel,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Label } from "@/components/ui/label"
import { EXCEPCIONES } from "@/constants/expeciones"
import { Combobox } from "./combobox"
import { Connection } from "@/types/connection"
import { getTablesOfConnection } from "@/services/connections"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    connections: Connection[]
}

export function DataTable<TData, TValue>({
    columns,
    data,
    connections,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    )
    const [tables, setTables] = useState<string[]>([])
    const fetchTables = async (connectionId: number) => {
        const res = await getTablesOfConnection(connectionId)
        setTables(res)
        setIsTablaFieldDisabled(false)
    }

    const [isTablaFieldDisabled, setIsTablaFieldDisabled] = useState(true)

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: {
            sorting,
            columnFilters
        },

    })

    return (
        <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 py-4 w-full gap-5">
                <div>
                    <Label>Base de datos</Label>
                    <Combobox
                        options={connections.map((c) => ({
                            label: c.name,
                            value: c.name.toLowerCase(),
                            id: c.id,
                        }))}
                        onSelect={(value, id) => {
                            console.log(value, id)
                            id && fetchTables(id)
                            table.getColumn("database")?.setFilterValue(value)
                        }


                        }
                    />
                </div>
                <div>
                    <Label>Tabla</Label>
                    <Combobox
                        isDisabled={isTablaFieldDisabled}
                        options={tables.map((c) => ({
                            label: c,
                            value: c.toLowerCase(),
                        }))}
                        onSelect={(value) => table.getColumn("table")?.setFilterValue(value)}
                    />
                </div>
                <div>
                    <Label>Tipo de Excepción</Label>
                    {/* onValueChange={(value) => table.getColumn("exception_description")?.setFilterValue(value)} */}
                    <Combobox
                        options={EXCEPCIONES.map((excepcion) => ({
                            label: excepcion.nombre,
                            value: excepcion.nombre.toLowerCase(),
                        }))}
                        onSelect={(value) => table.getColumn("exception_description")?.setFilterValue(value)}
                    />

                </div>
                <div>
                    <Label>Fecha</Label>
                    <Input
                        type="date"
                        value={(table.getColumn("created_at")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("created_at")?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Anterior
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Siguiente
                </Button>
            </div>
        </div>

    )
}
