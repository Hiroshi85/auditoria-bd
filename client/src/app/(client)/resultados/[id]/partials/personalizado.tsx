"use client";
import { DataTable } from "@/components/layout/table/table-details";
import { ResultContainer } from "@/components/ui/result-container";
import { ResultsPersonalizadas } from "@/types/resultados";
import { Table2Icon } from "lucide-react";
import React from "react";
import FiltroResultado from "@/app/(client)/resultados/[id]/partials/filtros";
import Paginacion from "@/app/(client)/resultados/[id]/partials/paginacion";

type Props = {
    data: ResultsPersonalizadas
}

const ResultadoPersonalizado = ({ data }: Props) => {
  return (
    <div className="mx-auto">
      <div className="my-5">
        <h2 className="text-xl font-semibold">Resultados</h2>
        <div>
          <h3 className="italic">{data.name}</h3>
          <pre className="w-full bg-white rounded-md px-4 py-2 font-mono text-muted-foreground">
            {data.query}
          </pre>
        </div>
      </div>
      <ResultContainer type="ok">
        <header className="flex justify-between items-center space-x-2 space-y-3">
          <div className=" flex items-center gap-2">
            <Table2Icon size={20} />
            {data.table}
          </div>
          <div>
            {data.rows.count !== undefined && (
              <FiltroResultado registers_count={data.rows.count}/>
            )}
          </div>
        </header>
        <section>
          <DataTable
            columns={data.headers.map((header: string) => ({
              accessorKey: header,
              header: header,
            }))}
            data={data.rows.data ? data.rows.data : []}
          />
        </section>
        <footer>
          <Paginacion
            nextUrl={data.rows.next}
            prevUrl={data.rows.previous}
            currentPage={data.rows.current_page}
            total_pages={data.rows.total_pages}
          />
        </footer>
      </ResultContainer>
    </div>
  );
}

export default ResultadoPersonalizado