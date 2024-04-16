'use client'
import { getResultado } from '@/services/resultados'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import React from 'react'
import ResultadoSecuencialidad from './secuencialidad'
import { ResultsSecuencial } from '@/types/resultados'
import ResultadoPersonalizada from './personalizada'
import { PersonalizadaResult } from '@/types/excepciones/personalizadas'
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
    if (tipoExcepcion === "De Campos") { }
    if (tipoExcepcion === "De Tabla") { }
    if (tipoExcepcion === "Personalizado") { 
        return <ResultadoPersonalizada data={resultado.results as PersonalizadaResult} />
    }

}

export default Resultado