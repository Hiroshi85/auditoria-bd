import { API_HOST } from "@/constants/server"
import { getLastConnection } from "@/server/get-connection"
import { fetcheServer } from "@/server/server-fetch"
import { TableDetailsResponse } from "@/types/database"
import { Metadata } from "next"
import IntegridadTablasForm from "./partials/form"
import { TablesResponse } from "../../page"
import TableExceptionProvider from "./partials/context"
import ResultTableException from "./partials/results"

export const metadata: Metadata = {
    title: 'Integridad Tablas - Sistema Auditoría',
}

export default async function Page(props: {
    searchParams: {
        table?: string
    }
}) {
    
    if (!props.searchParams.table) {
        return <div>Se debe seleccionar una tabla</div>
    }

    const lastConnection = await getLastConnection()

    const columnsPromise = fetcheServer(`${API_HOST}/aud/connection/${lastConnection.id}/tables/${props.searchParams.table}`)

    const tablesPromise = fetcheServer(`${API_HOST}/aud/connection/${lastConnection.id}/tables`)

    const [columns, tables] = await Promise.all([columnsPromise, tablesPromise])

    return (
        <div className="container mx-auto">
            <div>
                <h2 className="text-2xl font-bold">Excepción de integridad de tablas</h2>
                <p>Tabla {props.searchParams.table}</p>
            </div>
            <TableExceptionProvider>
                <div>
                    <IntegridadTablasForm table={props.searchParams.table} details={columns.data as TableDetailsResponse} tables={tables.data as TablesResponse}/>
                </div>

                <div className="mt-5">
                    <ResultTableException />
                </div>

            </TableExceptionProvider>

        </div>
    )
}