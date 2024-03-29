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
    min: string,
    max: string,
    num_duplicates: number,
    duplicates: []
    num_missing: number,
    missing: string[],
    num_sequence_errors: number,
    sequence_errors: {
        expected: string,
        found: string
    }[]
}

export type SecuenciaOkResponse = {
    result: "ok",
    min: string,
    max: string,
}

export type SecuenciaResponse = SecuenciaExceptionResponse | SecuenciaOkResponse