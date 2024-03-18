import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LoginForm from "./partials/form";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth-options";
import { redirect } from "next/navigation";

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
                        Database Auditor
                    </CardTitle>
                    <CardDescription>
                        Sistema web de auditoría de base de datos MySQL y SQLServer
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <LoginForm />
                </CardContent>

            </Card>
        </div>
    )
}