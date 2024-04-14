import { ColumnDef } from "@tanstack/react-table";
type Row = { [key: string]: string | number | null | boolean }
export const columns = (json: Row[]): ColumnDef<Row>[] => {

    const keys = Object.keys(json[0])

    const columns: ColumnDef<Row>[] = keys.map((key) => {
        return {
            accessorKey: key,
            header: key,
        }
    })

    return columns
}