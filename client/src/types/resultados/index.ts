import { PaginatedData } from "../pagination"

export type Resultado = {
    id: number
    table: string
    database: string
    created_at: string
    exception_id: number
    exception_description: string

}

export type GetResultadosResponse = {
    error: string | null
    data: {
        user: number
        resultados: Resultado[]
        message: string
    } | null
}


export interface ResultsSecuencial {
    result: string
    table: string
    column: string
    database: string
    datetime_analysis: string
    min: number
    max: number
    num_duplicates: number
    duplicates: PaginatedData & {
        data: any[]
    }
    num_missing: number
    missing: PaginatedData & {
        data: any[]
    },
    num_sequence_errors: number
    sequence_errors: PaginatedData & {
        data: {
            expected: string,
            found: string
        }[]
    }
}

export interface ResultsCampos {
    database: string
    table: string
    accessed_on: string
    num_rows_exceptions: number
    conditions: {
        [key: string]: {
            condicion: "Where" | "No Nulo" | "Único"
            condicion_id: number
            condicion_where_id: number
            valor_uno: string
            valor_dos: string
        }[]
    }
    results: {
        [key: string]: string | number | boolean | null
    }[]
}
export interface ResultsTablas {
    table: string
    results: {
        column: string
        foreing_table: string
        foreing_column: string
        results: {
            primary_key: number
            foreign_key: any
            table_foreign_key: any
        }[]
    }[]
}

export interface ResultsPersonalizadas {
    result: string
    table: string
    name: string
    query: string
    timestamp: string
    num_rows: number
    data: {
        headers: string[]
        rows: {
            [key: string]: string | number | boolean | null
        }[]
    }
}



export type GetResultadoResponse = {
    error: string | null
    data: {
        id: number
        user: number
        database: string
        table: string
        created_at: string
        results: ResultsCampos | ResultsSecuencial | ResultsTablas | ResultsPersonalizadas
        exception_ocurred: number
        exception_id: 1 | 2 | 3 | 4
        exception_description: "Secuencial" | "De Campos" | "De Tabla" | "Personalizado"
    } | null
}

/**export const EXCEPCIONES = [
    { id: 1, nombre: 'Secuencial' },
    { id: 2, nombre: 'De Campos' },
    { id: 3, nombre: 'De Tabla' },
    { id: 4, nombre: 'Personalizado' },
]; */