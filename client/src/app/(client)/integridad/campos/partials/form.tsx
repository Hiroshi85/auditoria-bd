'use client'

import { useTable } from "@/app/(client)/partials/tables.context"
import { useConnectionDatabase } from "@/providers/connection"
import { useSearchParams } from "next/navigation"
import { useFieldArray, useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { z } from "zod"
import { PlusIcon, TrashIcon } from "@radix-ui/react-icons"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CONDICIONES, CONDICIONES_ENUM } from "@/constants/integridad/campos/condiciones"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { obtenerTipoDatoSQL } from "@/helpers/tipos-datos"
import { obtenerCondicionesDeLongitud, obtenerCondicionesDelTipo } from "@/helpers/condiciones"
import { Input } from "@/components/ui/input"
import { DIAS } from "@/constants/dias"
import { MESES } from "@/constants/meses"
import { ANIOS } from "@/constants/anios"
import { VerificarIntegridadDeCamposRequest } from "@/types/excepciones/integridad/campo"
import { useCamposContext } from "../campos.context"

const schema = z.object({
    columnas: z.array(z.object({
        nombre: z.string().refine((value) => value !== "", { message: "Debe seleccionar columna" }),
        tipo: z.string().refine((value) => ['numerico', 'cadena', 'tiempo', 'enum'].includes(value), { message: "Debe seleccionar columna" }),
        tipo_de_dato_id: z.number().min(1, { message: "Debe seleccionar columna" }),
        tipo_de_dato: z.string().refine((value) => value !== "", { message: "Debe seleccionar columna" }),
        condicion_id: z.number().min(1, { message: "Debe seleccionar condicion" }),
        condicion: z.string().refine((value) => value !== "", { message: "Debe seleccionar condicion" }),
        where: z.object({
            condicion_id: z.number(),
            nombre: z.string(),
            valor_uno: z.string(),
            valor_dos: z.string(),
            longitud: z.object({
                longitud_condicion_id: z.number(),
                nombre: z.string(),
            })
        })
    }).superRefine((val, ctx) => {
        // 1. Si la condicion_id es diferente de 0, entonces se deben validar los campos de where
        if (val.condicion_id !== 0) {
            if (val.condicion_id === CONDICIONES_ENUM.Where.id) {
                if (val.where.condicion_id === 0) {
                    return ctx.addIssue(
                        {
                            code: z.ZodIssueCode.custom,
                            message: 'Debe seleccionar una condicion para el campo where',
                            path: ['where', 'nombre']
                        }
                    )
                }
                if (val.where.nombre === 'longitud') {
                    if (val.where.longitud.longitud_condicion_id === 0) {
                        return ctx.addIssue(
                            {
                                code: z.ZodIssueCode.custom,
                                message: 'Debe seleccionar una condicion de longitud',
                                path: ['where', 'longitud', 'nombre']
                            }
                        )
                    }
                }
                if (val.where.valor_uno === "") {
                    return ctx.addIssue(
                        {
                            code: z.ZodIssueCode.custom,
                            message: 'Debe ingresar un valor',
                            path: ['where', 'valor_uno']
                        }
                    )
                }

                // si el tipo de dato es numerico
                if (val.tipo === 'numerico') {
                    if (isNaN(Number(val.where.valor_uno))) {
                        return ctx.addIssue(
                            {
                                code: z.ZodIssueCode.custom,
                                message: 'El valor debe ser numerico',
                                path: ['where', 'valor_uno']
                            }
                        )
                    }
                }

                // si el tipo de dato es tiempo
                if (val.tipo === 'tiempo') {
                    if (val.where.nombre === 'rangoHoras') {
                        const [hora, minuto] = val.where.valor_uno.split(":")
                        if (isNaN(Number(hora)) || isNaN(Number(minuto))) {
                            return ctx.addIssue(
                                {
                                    code: z.ZodIssueCode.custom,
                                    message: 'El valor debe ser de tipo tiempo',
                                    path: ['where', 'valor_uno']
                                }
                            )
                        }
                    }
                    if (val.where.nombre === 'entreFechas') {
                        if (isNaN(Date.parse(val.where.valor_uno))) {
                            return ctx.addIssue(
                                {
                                    code: z.ZodIssueCode.custom,
                                    message: 'El valor debe ser de tipo fecha',
                                    path: ['where', 'valor_uno']
                                }
                            )
                        }
                    }
                }


                if (val.where.nombre === 'entre' || val.where.nombre === 'entreFechas' || val.where.nombre === 'rangoHoras') {
                    if (val.where.valor_dos === "") {
                        return ctx.addIssue(
                            {
                                code: z.ZodIssueCode.custom,
                                message: 'Debe ingresar un segundo valor',
                                path: ['where', 'valor_dos']
                            }
                        )
                    }
                    // si el tipo de dato es numerico, entonces se debe validar que los valores sean numericos
                    if (val.tipo === 'numerico') {
                        if (isNaN(Number(val.where.valor_dos))) {
                            return ctx.addIssue(
                                {
                                    code: z.ZodIssueCode.custom,
                                    message: 'El valor debe ser numerico',
                                    path: ['where', 'valor_dos']
                                }
                            )
                        }
                        // tambien validar que el valor uno sea menor que el valor dos
                        if (Number(val.where.valor_uno) > Number(val.where.valor_dos)) {
                            return ctx.addIssue(
                                {
                                    code: z.ZodIssueCode.custom,
                                    message: 'El valor uno debe ser menor que el valor dos',
                                    path: ['where', 'valor_uno']
                                }
                            )
                        }
                    }
                    // si el tipo de dato es tiempo, entonces se debe validar que los valores sean de tipo tiempo
                    if (val.tipo === 'tiempo') {
                        if (val.where.nombre === 'rangoHoras') {
                            const [hora_uno, minuto_uno] = val.where.valor_uno.split(":")
                            const [hora_dos, minuto_dos] = val.where.valor_dos.split(":")
                            if (isNaN(Number(hora_uno)) || isNaN(Number(minuto_uno))) {
                                return ctx.addIssue(
                                    {
                                        code: z.ZodIssueCode.custom,
                                        message: 'El valor debe ser de tipo tiempo',
                                        path: ['where', 'valor_uno']
                                    }
                                )
                            }
                            if (isNaN(Number(hora_dos)) || isNaN(Number(minuto_dos))) {
                                return ctx.addIssue(
                                    {
                                        code: z.ZodIssueCode.custom,
                                        message: 'El valor debe ser de tipo tiempo',
                                        path: ['where', 'valor_dos']
                                    }
                                )
                            }
                        }
                        // si son fechas, entonces validar que sean fechas
                        if (val.where.nombre === 'entreFechas') {
                            if (isNaN(Date.parse(val.where.valor_dos))) {
                                return ctx.addIssue(
                                    {
                                        code: z.ZodIssueCode.custom,
                                        message: 'El valor debe ser de tipo fecha',
                                        path: ['where', 'valor_dos']
                                    }
                                )
                            }
                            if (Date.parse(val.where.valor_uno) > Date.parse(val.where.valor_dos)) {
                                return ctx.addIssue(
                                    {
                                        code: z.ZodIssueCode.custom,
                                        message: 'El valor uno debe ser menor que el valor dos',
                                        path: ['where', 'valor_uno']
                                    }
                                )
                            }
                        }
                    }

                }
            }
        }
    })

    ).nonempty({
        message: "Debe agregar al menos una columna"
    }),
})

const responseExample = [{ "id": 5, "type": "customers", "identity_document_type_id": "6", "number": "20429683581", "name": "CINEPLEX S.A", "trade_name": null, "internal_code": null, "barcode": null, "country_id": "PE", "nationality_id": null, "department_id": "15", "province_id": "1501", "district_id": "150122", "address_type_id": null, "address": "AV. JOSE LARCO NRO. 663 INT. 401", "condition": "HABIDO", "state": null, "email": null, "telephone": null, "accumulated_points": 0, "perception_agent": 0, "person_type_id": null, "contact": null, "comment": null, "percentage_perception": null, "enabled": 1, "website": null, "zone": null, "observation": null, "created_at": "2023-12-11T06:05:38", "updated_at": "2023-12-11T06:07:16", "status": 1, "credit_days": 0, "optional_email": null, "parent_id": 0, "zone_id": null, "seller_id": null, "has_discount": 0, "discount_type": "01", "discount_amount": 0, "edad": "", "excepciones": "number," }]

const IntegridadCamposForm = () => {

    const params = useSearchParams()
    const table = params.get('table') ?? ""
    const { id: connectionId } = useConnectionDatabase()
    const { data, isError, isLoading } = useTable(table, connectionId)
    const { auditException } = useCamposContext()

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        mode: 'onSubmit',
    })
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'columnas',
    })

    const watchColumns = form.watch('columnas')




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
        form.resetField(`columnas.${index}.condicion`)
        form.resetField(`columnas.${index}.condicion_id`)
        form.resetField(`columnas.${index}.where.condicion_id`)
        form.resetField(`columnas.${index}.where.nombre`)
        form.resetField(`columnas.${index}.where.valor_uno`)
        form.resetField(`columnas.${index}.where.valor_dos`)
        form.resetField(`columnas.${index}.where.longitud.longitud_condicion_id`)
        form.resetField(`columnas.${index}.where.longitud.nombre`)
        form.clearErrors();
    }

    const resetearAlCambiarCondicion = (index: number) => {

        form.resetField(`columnas.${index}.where.condicion_id`)
        form.resetField(`columnas.${index}.where.nombre`)
        form.resetField(`columnas.${index}.where.valor_uno`)
        form.resetField(`columnas.${index}.where.valor_dos`)
        form.resetField(`columnas.${index}.where.longitud.longitud_condicion_id`)
        form.resetField(`columnas.${index}.where.longitud.nombre`)

        form.clearErrors();
    }

    const setWhereCondicionIdGivenName = (name: string, index: number) => {
        const tipo_de_dato = form.getValues(`columnas.${index}.tipo`) as 'numerico' | 'cadena' | 'tiempo' | 'enum'
        const condicion_id = CONDICIONES[CONDICIONES_ENUM.Where.index]?.condicion?.[tipo_de_dato]?.find((condicion) => condicion.name === name)?.id ?? 0
        form.setValue(`columnas.${index}.where.condicion_id`, condicion_id)
    }
    const resetearAlCambiarCondicionWhere = (index: number) => {
        form.resetField(`columnas.${index}.where.valor_uno`)
        form.resetField(`columnas.${index}.where.valor_dos`)
        form.resetField(`columnas.${index}.where.longitud.longitud_condicion_id`)
        form.resetField(`columnas.${index}.where.longitud.nombre`)
        form.clearErrors();
    }

    const setWhereLongitudCondicionIdGivenName = (name: string, index: number) => {
        const condicion_id = obtenerCondicionesDeLongitud().find((condicion) => condicion.name === name)?.id ?? 0
        form.setValue(`columnas.${index}.where.longitud.longitud_condicion_id`, condicion_id)
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


    async function onSubmit(data: z.infer<typeof schema>) {
        const requestData: VerificarIntegridadDeCamposRequest = {
            columnas: data.columnas,
            table,
            connectionId
        }
        auditException(requestData)
    }

    return (
        <section>
            <h1 className="text-xl font-bold">Excepción de integridad de campos</h1>
            <h2 className="text-lg">Tabla {table}</h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 flex flex-col">
                    {form.formState.errors.columnas && <p className="text-red-500">{form.formState.errors.columnas.message}</p>}
                    {fields.map((item, index) => (
                        <div key={item.id} className="flex items-start justify-start gap-x-2 py-2">
                            <Button type="button" onClick={() => remove(index)} className="mt-[24px]"><TrashIcon /></Button>
                            {form.formState.errors.columnas?.[index] && <p className="text-red-500">{form.formState.errors.columnas?.[index]?.message}</p>}
                            <div className="gap-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                                <div className="">
                                    <FormField
                                        control={form.control}
                                        name={`columnas.${index}.nombre`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="flex items-center justify-between">
                                                    <FormLabel>Columna</FormLabel>
                                                    <span className="text-[0.6rem] font-medium px-2 bg-emerald-200 rounded-full h-[15px]">{watchColumns[index].tipo_de_dato}</span>
                                                </div>
                                                <Select
                                                    value={field.value}
                                                    name={field.name}
                                                    onValueChange={(value) => {
                                                        resetearAlCambiarColumna(index)
                                                        field.onChange(value)
                                                        setTipoDeDato(value, index)
                                                    }}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue onBlur={field.onBlur} ref={field.ref} placeholder="Seleccione campo" />
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
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Condicion</FormLabel>
                                                <Select
                                                    value={field.value}
                                                    name={field.name}
                                                    onValueChange={(value) => {
                                                        field.onChange(value)
                                                        resetearAlCambiarCondicion(index)
                                                        setCondicionIdGivenName(value, index)

                                                    }}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue onBlur={field.onBlur} ref={field.ref}
                                                                placeholder="Seleccione condicion" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent
                                                        className="w-full">
                                                        {CONDICIONES.filter((column) => (column.id != 2)).map((column) => (
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
                                                    <FormItem className="flex flex-col">
                                                        <FormLabel>Condicion</FormLabel>
                                                        <Select
                                                            name={field.value}
                                                            value={field.value}
                                                            disabled={watchColumns[index]?.nombre === ""}
                                                            onValueChange={(value) => {
                                                                field.onChange(value)
                                                                resetearAlCambiarCondicionWhere(index)
                                                                setWhereCondicionIdGivenName(value, index)
                                                            }}
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue onBlur={field.onBlur} ref={field.ref}
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
                                                    <FormItem className="flex flex-col">
                                                        <FormLabel>Condicion</FormLabel>
                                                        <Select
                                                            name={field.value}
                                                            value={field.value}
                                                            disabled={watchColumns[index]?.where.nombre !== "longitud"}
                                                            onValueChange={(value) => {
                                                                field.onChange(value)
                                                                setWhereLongitudCondicionIdGivenName(value, index)
                                                            }}
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue onBlur={field.onBlur} ref={field.ref}
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
                                                    <FormItem className="flex flex-col">
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
                                                    <FormItem className="flex flex-col">
                                                        <FormLabel>Valor</FormLabel>
                                                        <Select
                                                            name={field.value}
                                                            value={field.value}
                                                            onValueChange={(value) => {
                                                                field.onChange(value)
                                                            }}
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue onBlur={field.onBlur} ref={field.ref}
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
                                                    <FormItem className="flex flex-col">
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
                        className="w-12"
                    >
                        <PlusIcon />
                    </Button>

                    <Button type="submit" className="mt-3 w-fit" disabled={form.formState.isSubmitting}>
                        {
                            form.formState.isSubmitting ? "Cargando..." : "Ejecutar"
                        }
                    </Button>

                </form>
            </Form>
        </section>)
}

export default IntegridadCamposForm