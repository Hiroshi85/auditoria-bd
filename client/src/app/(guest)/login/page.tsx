import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LoginForm from "./partials/form";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth-options";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
    title: 'Login - Sistema Auditoría',
}

export default async function Page() {
    const session = await getServerSession(authOptions);

    if (session) {
        redirect("/");
    }
    return (
        <div className="w-full flex items-center justify-center h-dvh bg-accent">
            <Card>
                <CardHeader>
                    <CardTitle>
                        SISTEMA AUDITORÍA
                    </CardTitle>
                    <CardDescription>
                        Sistema web de auditoría de base de datos MySQL y SQLServer
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <LoginForm />
                    {/* <div className="flex justify-end w-full">
                        <Link href={"/register"} className={buttonVariants({
                            variant: "link",
                            className: "py-0"
                        })}>Registrarse</Link>
                    </div> */}
                </CardContent>

            </Card>
        </div>
    )
}