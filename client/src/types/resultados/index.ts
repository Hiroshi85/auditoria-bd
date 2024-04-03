const example = { "user": 1, "resultados": [{ "id": 1, "table": "persons", "created_at": "2024-04-02T20:48:42.793969", "exception_id": 2, "exception_description": "De Campos" }, { "id": 2, "table": "persons", "created_at": "2024-04-02T20:49:07.040166", "exception_id": 2, "exception_description": "De Campos" }], "message": "¡Conexión exitosa para bruno!" }

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