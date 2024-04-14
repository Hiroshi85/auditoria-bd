import { PaginatedData } from "@/types/pagination"

export interface VerificarSecuenciaRequest {
    table: string,
    column: string,
    sort?: "asc" | "desc" | "none",
    min?: string,
    max?: string
    example?: string,
    static?: boolean 
    step?: number,
    frequency?: "D" | "W" | "ME" | "MS" | "YE" | "YS" | undefined
}

export type SecuenciaExceptionResponse = {
    result: "exception",
    table: string,
    column: string,
    database: string,
    datetime_analysis: string,
    min: string,
    max: string,
    num_duplicates: number,
    duplicates: PaginatedData & {
        data: any[]
    }
    num_missing: number,
    missing: PaginatedData & {
        data: any[]
    },
    num_sequence_errors: number,
    sequence_errors: PaginatedData & {
        data: {
            expected: string,
            found: string
        }[]
    }
}

export type SecuenciaOkResponse = {
    result: "ok",
    table: string,
    column: string,
    database: string,
    datetime_analysis: string,
    min: string,
    max: string,
}

export type SecuenciaErrorResponse = {
    result: "error",
    message: string,
    min: string,
    max: string
}

export type SecuenciaResponse = SecuenciaExceptionResponse | SecuenciaOkResponse | SecuenciaErrorResponse