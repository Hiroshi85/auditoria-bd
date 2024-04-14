import { PaginatedData } from "@/types/pagination"

export type VerificarPersonalizadaRequest = {
    table: string,
    name: string,
    query: string,
    url?: string
}

export type PersonalizadaErrorResponse = {
    result: "error"
    query: string
    sql_error: string
    error_code: string
    instance_error: string
}


export type PersonalizadaOKResponse = {
    result: "ok"
    query: string
    timestamp: string
    table: string
    num_rows: number
    headers: string[]
    rows: PaginatedData & {
        data: any[]
    }
}

export type PersonalizadaResponse = PersonalizadaErrorResponse | PersonalizadaOKResponse

export type CustomQueriesResponse = {
    id: number
    name: string
    query: string
    table: string
    created_at: string
    updated_at: string
    connection: number
    only_this_connection: boolean
}

export type CustomQueriesRequest = {
    id?: number
    table: string
    name: string
    query: string
    only_this_connection: boolean
}