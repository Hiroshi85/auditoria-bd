"use client";
import Spinner from "@/components/ui/spinner";
import { useSecuencia } from "../secuencia.context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function SeqExceptionResults() {
  const { query } = useSecuencia();
  const { data, isLoading, isError } = query;

  return (
    <div className="flex flex-col bg-accent w-full rounded-lg p-4">
      {isLoading ? (
        <div className="w-full h-[200px] grid place-content-center">
          <Spinner />
        </div>
      ) : isError ? (
        <p className="text-red txt-md">Error al cargar los resultados</p>
      ) : !data ? (
        <p></p>
      ) : (
        <div>
          <header>
            <p>Valor mínimo evaluado: {data.min}</p>
            <p>Valor máximo evaluado: {data.max}</p>
            <p>Resultado: {data.result}</p>
          </header>
          {data.result === "exception" && (
            <main>
              <Tabs defaultValue="missing">
                <TabsList className="w-full">
                  <TabsTrigger value="missing">{`Registros faltantes ${data.num_missing}`}</TabsTrigger>
                  <TabsTrigger value="repeated">{`Registros repeditos ${data.num_duplicates}`}</TabsTrigger>
                  <TabsTrigger value="errors">{`Errores de secuencia ${data.num_sequence_errors}`}</TabsTrigger>
                </TabsList>
                <TabsContent
                  value="missing"
                  className="flex flex-col flex-wrap gap-x-4 gap-y-8"
                >
                  {data.missing.map((item, index) => {
                    return <span key={item}>{item}</span>;
                  })}
                </TabsContent>
                <TabsContent
                  value="repeated"
                  className="flex flex-wrap gap-x-4 gap-y-8"
                >
                  {data.duplicates.map((item) => {
                    return <span key={item}>{item}</span>;
                  })}
                </TabsContent>
                <TabsContent value="errors">
                  <Table>
                    <TableCaption>Fin de lista de errores de secuencia.</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px]">
                          Valor esperado
                        </TableHead>
                        <TableHead className="">Valor encontrado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.sequence_errors.map((item) => {
                        return (
                          <TableRow key={item.expected}>
                            <TableCell>{item.expected}</TableCell>
                            <TableCell>{item.found}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TabsContent>
              </Tabs>
            </main>
          )}
        </div>
      )}
    </div>
  );
}
