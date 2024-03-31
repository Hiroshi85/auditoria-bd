export type VerificarPersonalizadaRequest = {
    table: string,
    task_name: string,
    query: string
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
    data: {
        headers: [],
        rows: []
    }
}

export type PersonalizadaResponse = PersonalizadaErrorResponse | PersonalizadaOKResponse