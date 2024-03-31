export type DatabaseConnectionsType = "sqlserver" | "mysql"

export const DatabaseConnections: readonly [string, ...string[]] = ["sqlserver", "mysql"]

export interface Column {
    name: string
    type: string
    python_type: string
    nullable: boolean
    unique: boolean | null
    default: boolean | null
    primary_key: boolean
    foreign_key: ForeignKey[]
    autoincrement: boolean | string
    constraints: any[]
    key: string
}

export interface ForeignKey {
    table: string
    column: string
}

export interface TableDetailsResponse {
    columns: Column[]
}
