"use client";

import { set } from "react-hook-form";
import TableElement from "./list-tables-element";
import { ChangeEvent, useState } from "react";
import { Input } from "@/components/ui/input";
export default function ListTables({ tables }: { tables: string[] }) {
  const [filteredTables, setFilteredTables] = useState(tables);

  function filterTables(e: ChangeEvent<HTMLInputElement>) {
    setFilteredTables(
      tables.filter((table) =>
        table.toLowerCase().startsWith(e.target.value.toLowerCase())
      )
    );
  }

  return (
    <section className="w-[250px] space-y-4">
      <Input
        className="focus-visible:ring-offset-0"
        placeholder="Buscar tabla"
        onChange={(e) => filterTables(e)}
      />
      <div
        className="bg-accent rounded-md py-5 px-3 max-h-[calc(100dvh-200px)] space-y-2 overflow-y-auto"
        style={{ scrollbarGutter: "stable", scrollbarWidth: "thin" }}
      >
        {filteredTables.length > 0 ? (
          filteredTables.map((value) => {
            return <TableElement key={value} table={value} />;
          })
        ) : (
          <p className="text-center text-sm">No se encontraron tablas</p>
        )}
      </div>
    </section>
  );
}
