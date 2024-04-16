import { SecuenciaExceptionResponse, SecuenciaOkResponse } from "./exception-response"
import { SaveExceptionSuccess } from "@/types/excepciones"

export * from './exception-response'

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


// No necesita guardarse , se mantiene 
export type SecuenciaErrorResponse = {
    result: "error",
    message: string,
    min: string,
    max: string
}

export type SecuenciaResult = SecuenciaOkResponse | SecuenciaExceptionResponse

// Respuesta al guardar Excepción después de ejecutar
export type SecuenciaResponse = SaveExceptionSuccess | SecuenciaErrorResponse