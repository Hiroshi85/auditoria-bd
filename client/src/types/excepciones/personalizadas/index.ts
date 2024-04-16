import { SaveExceptionSuccess } from "@/types/excepciones"

export * from "./queries"
export * from './custom-response'

export type VerificarPersonalizadaRequest = {
    table: string,
    name: string,
    query: string,
}

export type PersonalizadaErrorResponse = {
    result: "error"
    query: string
    sql_error: string
    error_code: string
    instance_error: string
}

export type PersonalizadaResponse = SaveExceptionSuccess | PersonalizadaErrorResponse 

