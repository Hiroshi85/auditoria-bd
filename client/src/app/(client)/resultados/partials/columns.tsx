"use client"

import { ArrowUpDown } from "lucide-react"
import { Resultado } from "@/types/resultados"
import { ColumnDef } from "@tanstack/react-table"
import { EyeIcon, Trash2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import moment from 'moment'
import Link from "next/link"


export const columns: ColumnDef<Resultado>[] = [
    {
        accessorKey: "id",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    ID
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "database",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Database
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "table",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Tabla
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "exception_description",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Excepción
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "created_at",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Fecha y Hora
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const date = moment(row.getValue("created_at") as string).format('lll')
            return date
        }
    },
    {
        accessorKey: "exception_ocurred",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Resultados
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },

        cell: ({ row }) => {
            const exception = row.getValue("exception_ocurred") as boolean
            return exception ? <span
                className="bg-red-600 rounded-full text-white px-3 py-1 text-xs text-center"
            >
                Errores encontrados
            </span> : <span
                className="bg-green-600 rounded-full text-white px-3 py-1 text-xs text-center"
            >
                Sin errores
            </span>
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const resultado = row.original

            return (
                <div
                    className="flex items-center justify-center gap-3"
                >
                    <Link
                        href={`/resultados/${resultado.id}`}
                        className="rounded-full  p-1"
                    >
                        <EyeIcon className="text-gray-500" size={20} />
                    </Link>
                    <button
                        className="rounded-full  p-1"
                    >
                        <Trash2Icon className="text-gray-500" size={20} />
                    </button>
                </div>
            )
        },
    },
]
