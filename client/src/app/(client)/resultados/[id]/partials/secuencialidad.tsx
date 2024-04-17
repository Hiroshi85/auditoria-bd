"use client";
import { Badge } from "@/components/ui/badge";

import { ResultContainer } from "@/components/ui/result-container";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ResultsSecuencial } from "@/types/resultados";
import { InfoIcon } from "lucide-react";
import React from "react";
import Paginacion from "./paginacion";
import FiltroResultado from "./filtros";

function getTabColor(array: any[]) {
  return array.length > 0 && "text-red-600";
}

type Props = {
  data: ResultsSecuencial;
};
const ResultadoSecuencialidad = ({ data }: Props) => {
  return (
    <div className="mx-auto">
      {data.result === "error" ? (
        <ResultContainer type="error" className="text-red txt-md">
          <p className="text-destructive font-semibold">{"nada"}</p>
          {data.min && data.max && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex gap-4">
                <InfoIcon className="mt-2" />
                <div>
                  <h2 className="text-blue-500 leading-tight font-bold">
                    Registros encontrados
                  </h2>
                  <h3 className="text-sm leading-tight text-muted-foreground font-semibold">
                    Intente con alguno de ellos como ejemplo de secuencia
                  </h3>
                  <div className="[&>p]:text-sm">
                    <p>
                      <strong>Valor mínimo:</strong> {data.min}
                    </p>
                    <p>
                      <strong>Valor máximo:</strong> {data.max}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </ResultContainer>
      ) : (
        <ResultContainer type={data.result === "exception" ? "error" : "ok"}>
          <header className="space-y-4">
            <div className="flex flex-row justify-between">
              <div>
                <p>
                  <strong>Base de datos:</strong> {data.database}
                </p>
                <p>
                  <strong>Tabla: </strong> {data.table}
                </p>
              </div>
              <div>
                <p>
                  <strong>Fecha y hora:</strong> {data.datetime_analysis}
                </p>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold bg-primary rounded-lg py-2 px-2 text-white relative">
                Detalles del análisis
                <Badge
                  variant={data.result === "ok" ? "outline" : "destructive"}
                  className="text-white absolute right-2 top-3"
                >
                  {data.result === "ok"
                    ? "Secuencia correcta"
                    : "Secuencia incorrecta"}
                </Badge>
              </h2>

              <div className="px-2 mt-2">
                <p>
                  <strong>Valor mínimo:</strong> {data.min}
                </p>
                <p>
                  <strong>Valor máximo:</strong> {data.max}
                </p>
              </div>
            </div>
          </header>
          {data.result === "exception" && (
            <main className="relative">
              <Tabs defaultValue="missing">
                <TabsList className="w-full mb-4 space-x-2 bg-transparent">
                  <TabsTrigger
                    value="missing"
                    className={cn(getTabColor(data.missing.data))}
                  >{`Registros faltantes ${data.missing.count}`}</TabsTrigger>
                  <TabsTrigger
                    value="repeated"
                    className={cn(getTabColor(data.duplicates.data))}
                  >{`Registros repeditos ${data.duplicates.count}`}</TabsTrigger>
                  <TabsTrigger
                    value="errors"
                    className={cn(getTabColor(data.sequence_errors.data))}
                  >{`Errores de secuencia ${data.sequence_errors.count}`}</TabsTrigger>
                </TabsList>
                <TabsContent value="missing" className="flex flex-col gap-2">
                  <FiltroResultado
                    page_size_query="missing_page_size"
                    search_query="search_missing"
                    strict_query="strict_missing"
                    registers_count={data.missing.count}
                  />
                  {data.missing.count > 0 ? (
                    <div className="flex flex-wrap gap-8">
                      {data.missing.data.map((item, index) => {
                        return (
                          <span key={item} className={"min-w-[60px]"}>
                            {item}
                          </span>
                        );
                      })}
                      <Paginacion
                        nextUrl={data.missing.next}
                        prevUrl={data.missing.previous}
                        total_pages={data.missing.total_pages}
                        currentPage={data.missing.current_page}
                        page_query="missing_page"
                      />
                    </div>
                  ) : (
                    <div>
                      No se encontraron valores perdidos en la secuencia
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="repeated" className="flex flex-col ">
                  <FiltroResultado
                    page_size_query="missing_page_size"
                    search_query="search_duplicates"
                    strict_query="strict_duplicates"
                    registers_count={data.missing.count}
                  />
                  {data.duplicates.count > 0 ? (
                    <div className="flex flex-wrap gap-8">
                      {data.duplicates.data.map((item) => {
                        return (
                          <span key={item} className={"min-w-[60px]"}>
                            {item}
                          </span>
                        );
                      })}
                      <Paginacion
                        nextUrl={data.duplicates.next}
                        prevUrl={data.duplicates.previous}
                        total_pages={data.duplicates.total_pages}
                        currentPage={data.duplicates.current_page}
                        page_query="duplicates_page"
                      />
                    </div>
                  ) : (
                    <div className="mx-auto text-muted-foreground">
                      No se encontraron registros repetidos
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="errors">
                  <FiltroResultado
                    page_size_query="sequence_page_size"
                    search_query="search_sequence"
                    strict_query="strict_sequence"
                    registers_count={data.missing.count}
                  />
                  <Table className="w-full text-center mx-auto">
                    <TableCaption>
                      Fin de lista de errores de secuencia.
                    </TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-center">#</TableHead>
                        <TableHead className="text-center">
                          Valor esperado
                        </TableHead>
                        <TableHead className="text-center">
                          Valor encontrado
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.sequence_errors.count > 0 &&
                        data.sequence_errors.data.map((item, index) => {
                          return (
                            <TableRow key={item.expected}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>{item.expected}</TableCell>
                              <TableCell>{item.found}</TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>

                  <Paginacion
                    currentPage={data.sequence_errors.current_page}
                    nextUrl={data.sequence_errors.next}
                    prevUrl={data.sequence_errors.previous}
                    total_pages={data.sequence_errors.total_pages}
                    page_query="sequence_page"
                  />
                </TabsContent>
              </Tabs>
            </main>
          )}
        </ResultContainer>
      )}
    </div>
  );
};

export default ResultadoSecuencialidad;
