import { Metadata } from "next";
import { columns } from "./partials/columns";
import { getResultados } from "@/server/resultados";
import { getAllConnections } from "@/server/connections";
import { DataTable } from "./partials/data-table";
import { removeDuplicatesConnections } from "@/helpers/connections/removeDuplicates";
import { getToken } from "@/server/token";

export const metadata: Metadata = {
    title: 'Resultados - Database Auditor',
};

export default async function Page() {

    const [resultadosResponse, connections] = await Promise.all([
        getResultados(),
        getAllConnections()
    ]);
    const token = getToken()?.value;

    return (
        <main className="flex flex-col gap-4 container">
            <h1 className="font-bold text-xl">Resultados de auditoría</h1>
            {resultadosResponse.error ? (
                <div className="bg-red-100 text-red-900 p-4 rounded-md">
                    {resultadosResponse.error}
                </div>
            ) : (
                resultadosResponse.data && resultadosResponse.data.resultados.length > 0 && (
                    <DataTable
                        token={token || ""}
                        connections={removeDuplicatesConnections(connections)}
                        columns={columns}
                        data={resultadosResponse.data.resultados}
                    />
                )
            )}
        </main>
    );
}
