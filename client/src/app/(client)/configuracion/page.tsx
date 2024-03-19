import { Metadata } from "next"
import DatabaseStatus from "./partials/status"
import DatabaseConnectionForm from "./partials/form"

export const metadata: Metadata = {
    title: 'Configuración - Database Auditor',
}

export default function Page() {
    return (
        <main className="max-w-3xl container mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Conexión a la base de datos</h1>
                    <p className="text-sm text-muted-foreground">Proporciona los detalles de conexión necesarios a continuación para establecer una conexión</p>
                </div>

                <div>
                    <DatabaseStatus />
                </div>
            </div>
            <div>
                <DatabaseConnectionForm />
            </div>
        </main>
    )
}