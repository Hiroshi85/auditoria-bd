"use client"

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod"

const loginSchema = z.object({
    username: z
        .string(),
    password: z
        .string()
        .min(3, "La contraseña debe tener al menos 8 caracteres")
        .max(100, "La contraseña debe tener menos de 100 caracteres"),
})

export default function LoginForm() {
    const route = useRouter();
    const searchParams = useSearchParams();
    const errorCred = searchParams.get("error")

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    })

    async function onSubmit(data: z.infer<typeof loginSchema>) {
        try{
            await signIn("login", { username: data.username, password: data.password })
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <>
            {
                errorCred && errorCred == 'CredentialsSignin' && (
                    <div className="bg-red-500 text-white p-3 rounded-md mb-3">
                        <p className="font-semibold">Credenciales incorrectas</p>
                        <p className="text-sm">El correo o la contraseña son incorrectos</p>
                    </div>
                )
            }

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                    <FormField 
                        control={form.control}
                        name="username"
                        render={({ field, formState }) => (
                            <FormItem>
                                <FormLabel>Usuario</FormLabel>
                                <FormControl>
                                    <Input placeholder="admin" {...field}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Password */}
                    <FormField 
                        control={form.control}
                        name="password"
                        render={({ field, formState }) => (
                            <FormItem>
                                <FormLabel>Contraseña</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="********" {...field}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Submit */}
                    <Button type="submit" className="mt-3 w-full" disabled={form.formState.isSubmitting}>
                        {
                            form.formState.isSubmitting ? "Cargando..." : "Iniciar sesión"
                        }
                    </Button>

                </form>
            </Form>
        </>
    )

}