"use client"

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { register } from "@/server/register";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod"

const registerSchema = z.object({
    username: z
        .string(),
    password: z
        .string()
        .min(3, "La contraseña debe tener al menos 8 caracteres")
        .max(100, "La contraseña debe tener menos de 100 caracteres"),
    email: z
        .string()
        .min(3, "La contraseña debe tener al menos 8 caracteres")
        .max(100, "La contraseña debe tener menos de 100 caracteres")
})

export default function RegisterFrom() {
    const route = useRouter();
    const searchParams = useSearchParams();
    const errorCred = searchParams.get("error")

    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: "",
            password: "",
            email: ""
        },
    })

    async function onSubmit(data: z.infer<typeof registerSchema>) {
        const response = await register(data);

        if (response.error) {
            toast.error(response.error)
            return;
        }

        toast.success("Usuario registrado correctamente. Ya puede iniciar sessión")

        // route.push("/login")
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
                                    <Input placeholder="admin" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Email */}
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field, formState }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="admin@admin.com" {...field} />
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
                                    <Input type="password" placeholder="********" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Submit */}
                    <Button type="submit" className="mt-3 w-full" disabled={form.formState.isSubmitting}>
                        {
                            form.formState.isSubmitting ? "Cargando..." : "Registrarse"
                        }
                    </Button>

                </form>
            </Form>
        </>
    )

}