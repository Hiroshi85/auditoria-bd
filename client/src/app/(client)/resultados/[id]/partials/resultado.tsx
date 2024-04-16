'use client'
import { getResultado } from '@/services/resultados'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams, useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'
import ResultadoSecuencialidad from './secuencialidad'
import { ResultsCampos, ResultsPersonalizadas, ResultsSecuencial, ResultsTablas } from '@/types/resultados'
import ResultadoCampos from './campos'
import ResultadoTablas from './tablas'
import ResultadoPersonalizado from './personalizado'
const Resultado = () => {
    const queryClient = useQueryClient()
    const params = useParams()
    const id = params.id as string
    const searchParams = useSearchParams()
    
    const currentQuery = searchParams.toString()
    console.log('currentQuery', currentQuery)
    

    const { data, isError, error, isLoading } = useQuery({
        queryKey: ["resultado", id],
        queryFn: () => getResultado(id, currentQuery),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    })

    useEffect(() => {
        queryClient.invalidateQueries({queryKey: ["resultado", id]})
    }, [currentQuery])

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
    if (tipoExcepcion === "Personalizado") {
        return <ResultadoPersonalizado id={resultado.exception_id} data={resultado.results as ResultsPersonalizadas} />
    }

}

export default Resultado