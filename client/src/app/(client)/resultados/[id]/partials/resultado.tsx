'use client'
import { getResultado } from '@/services/resultados'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import React from 'react'
import ResultadoSecuencialidad from './secuencialidad'
import { ResultsCampos, ResultsSecuencial, ResultsTablas } from '@/types/resultados'
import ResultadoCampos from './campos'
import ResultadoTablas from './tablas'
const Resultado = () => {
    const params = useParams()
    const id = params.id as string
    const { data, isError, error, isLoading } = useQuery({
        queryKey: ["resultado", id],
        queryFn: () => getResultado(id),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    })

    if (isLoading) {
        return (
            <div>Cargando...</div>
        )
    }

    if (isError) {
        return (
            <div>Error: {error.message}</div>
        )
    }

    const resultado = data?.data

    if (!resultado) {
        return (
            <div>No se encontró el resultado</div>
        )
    }

    const tipoExcepcion = resultado.exception_description
    if (tipoExcepcion === "Secuencial") {
        return <ResultadoSecuencialidad data={resultado.results as ResultsSecuencial} />
    }
    if (tipoExcepcion === "De Campos") {
        return <ResultadoCampos data={resultado.results as ResultsCampos} />
    }
    if (tipoExcepcion === "De Tabla") {
        return <ResultadoTablas data={resultado.results as ResultsTablas} />
    }
    if (tipoExcepcion === "Personalizado") { }

}

export default Resultado