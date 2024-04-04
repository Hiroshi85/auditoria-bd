export interface Connection {
    id: number
    engine: string
    name: string
    host: string
    port: number
    username: string
    last_used: string
    current_used: boolean
}