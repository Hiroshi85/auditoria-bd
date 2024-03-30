'use client'

import { useTable } from "@/app/(client)/partials/tables.context"
import { useConnectionDatabase } from "@/providers/connection"
import { useSearchParams } from "next/navigation"
import { useFieldArray, useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { z } from "zod"
import { verificarIntegridadDeCamposRequest } from "@/server/excepciones/integridad/campo"
import { PlusIcon, TrashIcon } from "@radix-ui/react-icons"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CONDICIONES, CONDICIONES_ENUM } from "@/constants/integridad/campos/condiciones"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { TIPOS_DE_DATOS } from "@/constants/integridad/campos/tipos-datos"
import { obtenerTipoDatoSQL } from "@/helpers/tipos-datos"
import { obtenerCondicionesDeLongitud, obtenerCondicionesDelTipo } from "@/helpers/condiciones"
import { Input } from "@/components/ui/input"
import { DIAS } from "@/constants/dias"
import { MESES } from "@/constants/meses"
import { ANIOS } from "@/constants/anios"

const schema = z.object({
    columnas: z.array(z.object({
        nombre: z.string(),
        tipo: z.string(),
        tipo_de_dato_id: z.number(),
        tipo_de_dato: z.string(),
        condicion_id: z.number(),
        condicion: z.string(),
        where: z.object({
            condicion_id: z.number(),
            nombre: z.string(),
            valor_uno: z.string(),
            valor_dos: z.string(),
            longitud: z.object({
                longitud_condicion_id: z.number(),
                nombre: z.string(),
                valor_uno: z.string(),
                valor_dos: z.string(),
            })
        })
    }))
})
const IntegridadCamposForm = () => {

    const params = useSearchParams()
    const table = params.get('table') ?? ""
    const { id: connectionId } = useConnectionDatabase()
    const { data, isError, isLoading } = useTable(table, connectionId)

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
    })
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'columnas',
    })

    const watchColumns = form.watch('columnas')
    async function onSubmit(data: z.infer<typeof schema>) {
        try {
            console.log(data)
            // await verificarIntegridadDeCamposRequest({ table, data })
        } catch (error) {
            console.error(error)
        }
    }

    const addNewField = () => {
        append({
            nombre: "",
            tipo: "",
            tipo_de_dato_id: 0,
            tipo_de_dato: "",
            condicion_id: 0,
            condicion: "",
            where: {
                condicion_id: 0,
                nombre: "",
                valor_uno: "",
                valor_dos: "",
                longitud: {
                    longitud_condicion_id: 0,
                    nombre: "",
                    valor_uno: "",
                    valor_dos: "",
                }
            }
        })
    }
    if (isLoading) {
        return <p>Cargando...</p>
    }

    if (isError) {
        return <p>Error al cargar la tabla</p>
    }

    const columns = data?.columns ?? []
    const getWhereCondiciones = (name: string, index: number) => {
        const tipo_de_dato = obtenerTipoDatoSQL(columns.find((column) => column.name === name)?.type ?? "")
        if (!tipo_de_dato) return []
        const condiciones = obtenerCondicionesDelTipo(tipo_de_dato?.type)
        return condiciones ?? []
    }

    const setTipoDeDato = (name: string, index: number) => {
        const column = columns.find((column) => column.name === name)
        const tipo_de_dato = obtenerTipoDatoSQL(column?.type ?? "")
        form.setValue(`columnas.${index}.tipo`, tipo_de_dato?.type ?? "")
        form.setValue(`columnas.${index}.tipo_de_dato`, tipo_de_dato?.name ?? "")
        form.setValue(`columnas.${index}.tipo_de_dato_id`, tipo_de_dato?.id ?? 0)
    }

    const setCondicionIdGivenName = (name: string, index: number) => {
        const condicion_id = CONDICIONES.find((condicion) => condicion.name === name)?.id ?? 0
        form.setValue(`columnas.${index}.condicion_id`, condicion_id)
    }

    const resetearAlCambiarColumna = (index: number) => {
        form.setValue(`columnas.${index}.condicion`, "")
        form.setValue(`columnas.${index}.condicion_id`, 0)
        form.setValue(`columnas.${index}.where.condicion_id`, 0)
        form.setValue(`columnas.${index}.where.nombre`, "")
        form.setValue(`columnas.${index}.where.valor_uno`, "")
        form.setValue(`columnas.${index}.where.valor_dos`, "")
        form.setValue(`columnas.${index}.where.longitud.longitud_condicion_id`, 0)
        form.setValue(`columnas.${index}.where.longitud.nombre`, "")
        form.setValue(`columnas.${index}.where.longitud.valor_uno`, "")
        form.setValue(`columnas.${index}.where.longitud.valor_dos`, "")
    }

    const resetearAlCambiarCondicion = (index: number) => {
        form.setValue(`columnas.${index}.where.condicion_id`, 0)
        form.setValue(`columnas.${index}.where.nombre`, "")
        form.setValue(`columnas.${index}.where.valor_uno`, "")
        form.setValue(`columnas.${index}.where.valor_dos`, "")
        form.setValue(`columnas.${index}.where.longitud.longitud_condicion_id`, 0)
        form.setValue(`columnas.${index}.where.longitud.nombre`, "")
        form.setValue(`columnas.${index}.where.longitud.valor_uno`, "")
        form.setValue(`columnas.${index}.where.longitud.valor_dos`, "")
    }

    const resetearAlCambiarCondicionWhere = (index: number) => {
        form.setValue(`columnas.${index}.where.valor_uno`, "")
        form.setValue(`columnas.${index}.where.valor_dos`, "")
        form.setValue(`columnas.${index}.where.longitud.longitud_condicion_id`, 0)
        form.setValue(`columnas.${index}.where.longitud.nombre`, "")
        form.setValue(`columnas.${index}.where.longitud.valor_uno`, "")
        form.setValue(`columnas.${index}.where.longitud.valor_dos`, "")
    }


    const obtenerTipoDeInputSegunTipoDeDato = (tipo_de_dato: string, name_condicion: string) => {
        if (tipo_de_dato === 'numerico') {
            return "number"
        }
        if (tipo_de_dato === 'tiempo') {
            if (name_condicion === 'rangoHoras') {
                return "time"
            }
            if (name_condicion === 'diaSemana') {
                return "text"
            }
            if (name_condicion === 'mes') {
                return "number"
            }
            if (name_condicion === 'año') {
                return "number"
            }
            return "date"
        }
        return "text"
    }

    const obtenerOpcionesDeTiempoEspecial = (name: "diaSemana" | "mes" | "año" | string | undefined) => {
        if (!name) return []
        if (name === 'diaSemana') {
            return DIAS
        }
        if (name === "mes") {
            return MESES
        }
        if (name === "año") {
            return ANIOS
        }
        return []
    }

    return (<main className="container mx-auto p-5">
        <h1 className="text-xl font-bold">Excepción de integridad de campos</h1>
        <h2 className="text-lg">Tabla {table}</h2>

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                {fields.map((item, index) => (
                    <div key={item.id} className="flex gap-3 items-center lg:items-end">
                        <div className="flex gap-2 items-center min-w-32">
                            <Button type="button" onClick={() => remove(index)}><TrashIcon /></Button>
                            <span className="text-[8px] font-medium p-2 bg-emerald-200 rounded-full">{watchColumns[index].tipo_de_dato}</span>
                        </div>
                        <div className=" gap-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                            <div className="">
                                <FormField
                                    control={form.control}
                                    name={`columnas.${index}.nombre`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Columna</FormLabel>
                                            <Select
                                                {...field}
                                                onValueChange={(value) => {
                                                    resetearAlCambiarColumna(index)
                                                    field.onChange(value)
                                                    setTipoDeDato(value, index)
                                                }}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Seleccione campo" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {columns.map((column) => (
                                                        <SelectItem key={column.name} value={column.name}>{column.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="">
                                <FormField
                                    control={form.control}
                                    name={`columnas.${index}.condicion`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Condicion</FormLabel>
                                            <Select
                                                {...field}
                                                value={field.value}
                                                onValueChange={(value) => {
                                                    field.onChange(value)
                                                    resetearAlCambiarCondicion(index)
                                                    setCondicionIdGivenName(value, index)

                                                }}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue
                                                            placeholder="Seleccione condicion" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent
                                                    className="w-full">
                                                    {CONDICIONES.map((column) => (
                                                        <SelectItem key={column.name}
                                                            value={column.name}>{column.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            {
                                watchColumns[index]?.condicion === 'Where' && (
                                    <div className="">
                                        <FormField
                                            control={form.control}
                                            name={`columnas.${index}.where.nombre`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Condicion</FormLabel>
                                                    <Select
                                                        {...field}
                                                        value={field.value}
                                                        disabled={watchColumns[index]?.nombre === ""}
                                                        onValueChange={(value) => {
                                                            field.onChange(value)
                                                            resetearAlCambiarCondicionWhere(index)
                                                        }}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue
                                                                    placeholder="Seleccione condicion" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent
                                                            className="w-full">
                                                            {getWhereCondiciones(watchColumns[index]?.nombre, index).map((column) => (
                                                                <SelectItem key={column.name}
                                                                    value={column.name}>{column.title}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                )
                            }
                            {
                                watchColumns[index]?.where.nombre === 'longitud' && (
                                    <div className="">
                                        <FormField
                                            control={form.control}
                                            name={`columnas.${index}.where.longitud.nombre`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Condicion</FormLabel>
                                                    <Select
                                                        {...field}
                                                        value={field.value}
                                                        disabled={watchColumns[index]?.where.nombre !== "longitud"}
                                                        onValueChange={(value) => {
                                                            field.onChange(value)
                                                        }}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue
                                                                    placeholder="Seleccione condicion" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent
                                                            className="w-full">
                                                            {obtenerCondicionesDeLongitud().map((column) => (
                                                                <SelectItem key={column.name}
                                                                    value={column.name}>{column.title}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                )
                            }
                            {
                                (watchColumns[index]?.condicion === 'Where') &&
                                (
                                    (watchColumns[index]?.where.nombre !== ''
                                        && watchColumns[index]?.where.nombre !== 'longitud'
                                        && watchColumns[index]?.where.nombre !== 'diaSemana'
                                        && watchColumns[index]?.where.nombre !== 'mes'
                                        && watchColumns[index]?.where.nombre !== 'año'
                                    )
                                    ||

                                    (watchColumns[index]?.where.nombre == 'longitud' && watchColumns[index]?.where.longitud.nombre !== '')
                                ) &&
                                (
                                    <div className="">
                                        <FormField
                                            control={form.control}
                                            name={`columnas.${index}.where.valor_uno`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Valor</FormLabel>
                                                    <FormControl                                                    >
                                                        <Input
                                                            type={obtenerTipoDeInputSegunTipoDeDato(watchColumns[index]?.tipo, watchColumns[index]?.where.nombre)}
                                                            {...field}
                                                            onChange={(e) => {
                                                                field.onChange(e.target.value)
                                                            }
                                                            }
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                )
                            }
                            {
                                (watchColumns[index]?.condicion === 'Where') &&
                                (
                                    (watchColumns[index]?.where.nombre === 'diaSemana'
                                        || watchColumns[index]?.where.nombre === 'mes'
                                        || watchColumns[index]?.where.nombre === 'año'
                                    )
                                ) &&
                                (
                                    <div className="">
                                        <FormField
                                            control={form.control}
                                            name={`columnas.${index}.where.valor_uno`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Valor</FormLabel>
                                                    <Select
                                                        {...field}
                                                        value={field.value}
                                                        onValueChange={(value) => {
                                                            field.onChange(value)
                                                        }}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue
                                                                    placeholder="Seleccione" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent
                                                            className="w-full">
                                                            {obtenerOpcionesDeTiempoEspecial(watchColumns[index]?.where.nombre).map((column) => (
                                                                <SelectItem key={column.id}
                                                                    value={String(column.id)}>{column.nombre}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                )
                            }
                            {
                                (watchColumns[index]?.condicion === 'Where') &&
                                (
                                    watchColumns[index]?.where.nombre == 'entre'
                                    ||
                                    watchColumns[index]?.where.longitud.nombre == 'entre'
                                    ||
                                    watchColumns[index]?.where.nombre == 'entreFechas'
                                    ||
                                    watchColumns[index]?.where.nombre == 'rangoHoras'
                                )
                                &&
                                (
                                    <div className="">
                                        <FormField
                                            control={form.control}
                                            name={`columnas.${index}.where.valor_dos`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Valor</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type={obtenerTipoDeInputSegunTipoDeDato(watchColumns[index]?.tipo, watchColumns[index]?.where.nombre)}
                                                            {...field}
                                                            onChange={(e) => {
                                                                field.onChange(e.target.value)
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                )
                            }
                        </div>
                    </div>
                ))}
                <Button
                    type="button"
                    onClick={addNewField}
                >
                    <PlusIcon />
                </Button>
                <Button type="submit" className="mt-3 w-full" disabled={form.formState.isSubmitting}>
                    {
                        form.formState.isSubmitting ? "Cargando..." : "Ejecutar"
                    }
                </Button>

            </form>
        </Form>
    </main>)
}

export default IntegridadCamposForm