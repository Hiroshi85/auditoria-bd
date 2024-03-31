export type VerificarPersonalizadaRequest = {
    table: string,
    task_name: string,
    query: string
}

export type PersonalizadaErrorResponse = {
    result: "error"
    message: string
    error: string
    query: string
}

export type PersonalizadaOKResponse = {
    result: "ok"
    query: string
    timestamp: string
    data: {
        headers: [],
        rows: []
    }
}

export type PersonalizadaResponse = PersonalizadaErrorResponse | PersonalizadaOKResponse