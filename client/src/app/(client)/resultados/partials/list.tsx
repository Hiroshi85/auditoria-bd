'use client';
import React from 'react';
import { getAllConnections } from '@/services/connections';
import { getResultados } from '@/services/resultados';
import { removeDuplicatesConnections } from "@/helpers/connections/removeDuplicates";
import { useQuery } from '@tanstack/react-query';
import { DataTable } from './data-table';
import { columns } from './columns';

const ResultadosList = () => {

    const resultadosQuery = useQuery({
        queryKey: ["resultados"],
        queryFn: getResultados,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    const connectionsQuery = useQuery({
        queryKey: ["connections"],
        queryFn: getAllConnections,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    if (resultadosQuery.isLoading || connectionsQuery.isLoading) {
        return (
            <main className="flex flex-col gap-4 container">
                <h1 className="font-bold text-xl">Cargando...</h1>
            </main>
        );
    }

    if (resultadosQuery.error) {
        return (
            <main className="flex flex-col gap-4 container">
                <h1 className="font-bold text-xl">Resultados de auditoría</h1>
                <div className="bg-red-100 text-red-900 p-4 rounded-md">
                    {resultadosQuery.error.message}
                </div>
            </main>
        );
    }

    if (resultadosQuery.data?.data && resultadosQuery.data.data.resultados.length > 0) {
        return (
            <main className="flex flex-col gap-4 container">
                <h1 className="font-bold text-xl">Resultados de auditoría</h1>
                <DataTable
                    connections={removeDuplicatesConnections(connectionsQuery.data!)}
                    columns={columns}
                    data={resultadosQuery.data.data.resultados}
                />
            </main>
        );
    }

    return (
        <main className="flex flex-col gap-4 container">
            <h1 className="font-bold text-xl">Resultados de auditoría</h1>
            <div className="bg-yellow-100 text-yellow-900 p-4 rounded-md">
                No se encontraron resultados.
            </div>
        </main>
    );
}

export default ResultadosList;
