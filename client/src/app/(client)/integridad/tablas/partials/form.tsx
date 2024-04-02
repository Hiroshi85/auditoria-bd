"use client"

import { TablesResponse } from "@/app/(client)/page"
import { useTable } from "@/app/(client)/partials/tables.context"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useConnectionDatabase } from "@/providers/connection"
import { TableDetailsResponse } from "@/types/database"
import { zodResolver } from "@hookform/resolvers/zod"
import { TrashIcon } from "@radix-ui/react-icons"
import { CircleArrowRightIcon, ListStartIcon, PlusIcon } from "lucide-react"
import { UseFormReturn, useForm } from "react-hook-form"
import { z } from "zod"
import { AnimatePresence, motion } from "framer-motion"
import SelectSearch from "@/components/ui/select-search"
import { useTableException } from "./context"

const formSchema = z.object({
    table: z.string(),
    details: z.array(
        z.object({
            column_name: z.string().min(1),
            condition: z.enum(["PK", "FK"]),
            foreing_table: z.string().nullable(),
            foreing_column: z.string().nullable(),
        })
    )
})


export default function IntegridadTablasForm({
    table,
    details,
    tables
}: {
    table: string
    details: TableDetailsResponse
    tables: TablesResponse
}) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            table: table,
            details: []
        }
    })
    const { id } = useConnectionDatabase()

    const exception = useTableException()

    const watchColumns = form.watch('details')

    async function OnSubmit(data: z.infer<typeof formSchema>) {
        exception.auditException(data)
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(OnSubmit)} className="flex flex-col">

                <FormField
                    control={form.control}
                    name="details"
                    render={({ field }) => {
                        return (
                            <FormItem>
                                <AnimatePresence>
                                    {
                                        field.value.map((value, index) => (
                                            <motion.div className="flex justify-between"
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{
                                                    opacity: 1,
                                                    height: "auto"
                                                }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{
                                                    duration: 0.5,
                                                }} key={index}
                                            >
                                                <div className="flex gap-3 items-center" key={index}>
                                                    <div className="flex items-center py-2 gap-3">
                                                        <FormField
                                                            control={form.control}
                                                            name={`details.${index}.column_name`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Columna</FormLabel>
                                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                        <FormControl>
                                                                            <SelectTrigger className="w-[150px]">
                                                                                <SelectValue placeholder="Seleccione campo..." />
                                                                            </SelectTrigger>
                                                                        </FormControl>
                                                                        <SelectContent>
                                                                            {
                                                                                details.columns.map((column) => (
                                                                                    <SelectItem value={column.name} key={column.name}>{column.name}</SelectItem>
                                                                                ))
                                                                            }
                                                                        </SelectContent>
                                                                    </Select>
                                                                </FormItem>

                                                            )}
                                                        />

                                                        <FormField
                                                            control={form.control}
                                                            name={`details.${index}.condition`}
                                                            render={({ field, formState }) => (
                                                                <FormItem>
                                                                    <FormLabel>Condición</FormLabel>
                                                                    <Select onValueChange={
                                                                        (value) => {
                                                                            if (value == "PK") {
                                                                                form.setValue(`details.${index}.foreing_table`, null)
                                                                                form.setValue(`details.${index}.foreing_column`, null)
                                                                            } else {
                                                                                form.setValue(`details.${index}.foreing_table`, "")
                                                                                form.setValue(`details.${index}.foreing_column`, "")
                                                                            }
                                                                            field.onChange(value)
                                                                        }
                                                                    } defaultValue={field.value}>
                                                                        <FormControl>
                                                                            <SelectTrigger className="w-[150px]">
                                                                                <SelectValue placeholder="Seleccione campo..." />
                                                                            </SelectTrigger>
                                                                        </FormControl>
                                                                        <SelectContent>
                                                                            <SelectItem value="PK">PK</SelectItem>
                                                                            <SelectItem value="FK">FK</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </FormItem>

                                                            )}
                                                        />
                                                    </div>

                                                    <AnimatePresence>
                                                        {
                                                            watchColumns[index].condition == "FK" && (
                                                                <ForeingData form={form} index={index} tables={tables} />
                                                            )
                                                        }
                                                    </AnimatePresence>
                                                </div>

                                                <Button type="button" size={"icon"} onClick={() => {
                                                    form.setValue("details", form.getValues().details.filter((_, i) => i !== index))
                                                }}>
                                                    <TrashIcon className="w-4 h-4" />
                                                </Button>
                                            </motion.div>
                                        ))
                                    }
                                </AnimatePresence>
                            </FormItem>
                        )
                    }}
                />

                <Button type="button" size={"icon"}
                    className="mt-3"
                    onClick={() => {
                        form.setValue("details", [
                            ...form.getValues().details,
                            {
                                column_name: "",
                                condition: "PK",
                                foreing_table: null,
                                foreing_column: null,
                            }
                        ])
                    }}>
                    <PlusIcon className="w-4 h-4" />
                </Button>

                <div className="mt-3">
                    <Button type="submit" disabled={exception.query.isLoading}>
                        <CircleArrowRightIcon className="w-4 h-4 mr-1" />
                        Guardar
                    </Button>
                </div>

            </form>
        </Form>
    )
}


function ForeingData({
    form,
    index,
    tables
}: {
    form: UseFormReturn<{
        table: string;
        details: {
            column_name: string;
            condition: "PK" | "FK";
            foreing_table: string | null;
            foreing_column: string | null;
        }[];
    }, any, undefined>
    index: number
    tables: TablesResponse
}) {
    const { id } = useConnectionDatabase()

    const tableName = form.watch(`details.${index}.foreing_table`)

    const query = useTable(tableName == "" ? null : tableName, id)

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex gap-3 py-2 px-3 rounded-md border border-primary">
            <FormField
                control={form.control}
                name={`details.${index}.foreing_table`}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Tabla</FormLabel>
                        <SelectSearch
                            options={tables.tables.map((table, index) => {
                                return {
                                    label: table,
                                    value: table
                                }
                            })}

                            onChange={(value) => {
                                if (value == "") {
                                    form.setValue(`details.${index}.foreing_column`, null)
                                }
                                form.setValue(`details.${index}.foreing_column`, "")
    
                                field.onChange(value)
                            }}
                            initValue={field.value}
                            placeholder={"Selecciona una tabla"}
                        />
                    </FormItem>

                )}
            />

            <FormField
                control={form.control}
                name={`details.${index}.foreing_column`}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Columna</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value as string} disabled={query.isLoading || tableName == ""}>
                            <FormControl>
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Seleccione campo..." />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {
                                    query.data?.columns.map((column) => (
                                        <SelectItem value={column.name} key={column.name}>{column.name}</SelectItem>
                                    ))
                                }
                            </SelectContent>
                        </Select>
                    </FormItem>

                )}
            />

        </motion.div>
    )
}