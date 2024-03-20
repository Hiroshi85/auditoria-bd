"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useConnectionDatabase } from "@/providers/connection"
import { DatabaseConnections, DatabaseConnectionsType } from "@/types/database"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { set, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

const schema = z.object({
    engine: z.enum(DatabaseConnections), // Fix: Pass an array with at least one element
    name: z
        .string()
        .min(3, "El nombre de la base de datos debe tener al menos 3 caracteres"),
    host: z
        .string()
        .min(3, "El host debe tener al menos 3 caracteres"),
    port: z
        .coerce
        .number()
        .min(1, "El puerto debe ser mayor a 0"),
    username: z
        .string()
        .min(1, "El usuario debe tener al menos 1 caracter"),
    password: z
        .string()
})

export default function DatabaseConnectionForm() {
    const [testing, setTesting] = useState(false)

    const dataConnection = useConnectionDatabase()

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            engine: dataConnection.engine,
            name: dataConnection.name,
            host: dataConnection.host,
            port: dataConnection.port,
            username: dataConnection.username,
            password: dataConnection.password,
        },
    })

    async function onSubmit(data: z.infer<typeof schema>) {
        console.log("enviando datos...")
    }

    async function testConnections(data: z.infer<typeof schema>) {
        setTesting(true)
        const toastId = toast.loading("Probando conexión...")
        
        const response = await dataConnection.testConnections({
            engine: data.engine as DatabaseConnectionsType,
            name: data.name,
            host: data.host,
            port: data.port,
            username: data.username,
            password: data.password,
        })

        if (response.status) {
            toast.success(response.message, { id: toastId })
        }else {
            toast.error(response.message, { id: toastId })
        }
        setTesting(false)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid grid-cols-2 gap-3 mt-5">
                    <FormField
                        control={form.control}
                        name="engine"
                        render={({ field, formState }) => (
                            <FormItem>
                                <FormLabel>Motor de base de datos</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Motor de base de datos" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {
                                            DatabaseConnections.map((item, index) => (
                                                <SelectItem key={index} value={item}>{item}</SelectItem>
                                            ))
                                        }
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field, formState }) => (
                            <FormItem>
                                <FormLabel>Nombre de base de datos</FormLabel>
                                <FormControl>
                                    <Input placeholder="AuditoriaBD" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="host"
                        render={({ field, formState }) => (
                            <FormItem>
                                <FormLabel>Host / IP</FormLabel>
                                <FormControl>
                                    <Input placeholder="localhost" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="port"
                        render={({ field, formState }) => (
                            <FormItem>
                                <FormLabel>Puerto</FormLabel>
                                <FormControl>
                                    <Input placeholder="1433" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field, formState }) => (
                            <FormItem>
                                <FormLabel>Usuario</FormLabel>
                                <FormControl>
                                    <Input placeholder="root" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field, formState }) => (
                            <FormItem>
                                <FormLabel>Contraseña</FormLabel>
                                <FormControl>
                                    <Input placeholder="********" type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex justify-end mt-3 gap-3">
                    <Button type="button" variant="secondary" onClick={() => {
                        form.handleSubmit(testConnections)();
                    }}>
                        {
                            testing ? "Probando conexión..." : "Probar conexión"
                        }
                    </Button>
                    
                    <Button type="submit">
                        {
                            form.formState.isSubmitting && !testing ? "Cargando..." : "Guardar"
                        }
                    </Button>

                </div>
            </form>
        </Form>
    )

}