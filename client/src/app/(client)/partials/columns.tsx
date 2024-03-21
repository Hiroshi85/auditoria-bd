import { Column } from "@/types/database";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Column>[] = [
    {
      accessorKey: "name",
      header: "Campo",
    },
    {
      accessorKey: "type",
      header: "Tipo",
    },
    {
      accessorKey: "nullable",
      header: "Null",
      cell: (cell) => (cell.row.original.nullable ? "Si" : "No"),
    },
    {
        accessorKey: "key",
        header: "Key",
    },
    {
        accessorKey: "default",
        header: "Default",
        cell: ({row}) => {
            if (row.original.default == null) {
                return ""
            }

            return String(row.original.default)
        },
    }
  ]