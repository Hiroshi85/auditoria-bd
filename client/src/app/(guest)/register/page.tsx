import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import RegisterFrom from "./partials/form";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth-options";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
    title: 'Register - Sistema Auditoría',
}

export default async function Page() {
    const session = await getServerSession(authOptions);

    // if (session) {
    //     redirect("/");
    // }
    redirect("/login")
    return (
        <div className="w-full flex items-center justify-center h-dvh bg-accent">
            <Card>
                <CardHeader>
                    <CardTitle>
                        SISTEMA AUDITORÍA - Registro
                    </CardTitle>
                    <CardDescription>
                        Sistema web de auditoría de base de datos MySQL y SQLServer
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <RegisterFrom />
                    <div className="flex justify-end w-full">
                        <Link href={"/login"} className={buttonVariants({
                            variant: "link",
                            className: "py-0"
                        })}>Iniciar sesión</Link>
                    </div>
                </CardContent>

            </Card>
        </div>
    )
}