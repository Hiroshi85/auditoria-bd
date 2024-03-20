import { getLastConnection } from "@/server/get-connection"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: 'Resultados - Database Auditor',
}

export default async function Page() {
    const connection = await getLastConnection()

    if (connection.id == 0) return "nada"
    
    return "Resultados"
}