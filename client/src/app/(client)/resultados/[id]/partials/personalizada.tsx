import { ResultContainer } from "@/components/ui/result-container";
import { Table2Icon } from "lucide-react";
import { DataTable } from "@/components/layout/table/table-details";
import { Button } from "@/components/ui/button";
import { PersonalizadaResult } from "@/types/excepciones/personalizadas";

interface Props {
    data: PersonalizadaResult;
}
function ResultadoPersonalizada(
    {data} : Props
) {
  return (
    <ResultContainer type="ok">
      <header className="flex justify-between items-center space-x-2 space-y-3">
        <div className=" flex items-center gap-2">
          <Table2Icon size={20} />
          {data.table}
        </div>
        <div>
          {data.rows.count} filas en total limitado a {data.rows.page_size}
        </div>
      </header>
      <section>
        <DataTable
          columns={data.headers.map((header: string) => ({
            accessorKey: header,
            header: header,
          }))}
          data={data.rows.data}
        />
      </section>
      <footer>
        <Button
          variant={"outline"}
          onClick={() => console.log("previous")}
          disabled={data.rows.previous === null}
        >
          Anterior
        </Button>
        <Button
          variant={"outline"}
          onClick={() => console.log("next")}
          disabled={data.rows.next === null}
        >
          Siguiente
        </Button>
      </footer>
    </ResultContainer>
  );
}

export default ResultadoPersonalizada;
