"use client";
import Alertas from "@/components/alertas";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
import usePagination from "@/hooks/results/pagination";
import { cn } from "@/lib/utils";
import { ResultsSecuencial } from "@/types/resultados";
import { InfoIcon } from "lucide-react";
import next from "next";
import { pages } from "next/dist/build/templates/app-page";
import React from "react";

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
              {data.result !== "ok" && <Alertas tipoExcepcion="Secuencial" />
              }
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
            <main>
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
                <TabsContent
                  value="missing"
                  className="flex flex-wrap gap-x-8 gap-y-8"
                >
                  {data.missing.count > 0 ? (
                    <>
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
                      />
                    </>
                  ) : (
                    <> ad</>
                  )}
                </TabsContent>
                <TabsContent
                  value="repeated"
                  className="flex flex-wrap gap-x-8 gap-y-8"
                >
                  {data.duplicates.count > 0 ? (
                    <>
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
                      />{" "}
                    </>
                  ) : (
                    <div className="mx-auto text-muted-foreground">
                      No se encontraron registros repetidos
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="errors">
                  <Table className="w-fit text-center">
                    <TableCaption>
                      Fin de lista de errores de secuencia.
                    </TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-80px">#</TableHead>
                        <TableHead>Valor esperado</TableHead>
                        <TableHead>Valor encontrado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.sequence_errors.count > 0 ? (
                        <>
                          {data.sequence_errors.data.map((item, index) => {
                            return (
                              <TableRow key={item.expected}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{item.expected}</TableCell>
                                <TableCell>{item.found}</TableCell>
                              </TableRow>
                            );
                          })}
                          <Paginacion
                            currentPage={data.sequence_errors.current_page}
                            nextUrl={data.sequence_errors.next}
                            prevUrl={data.sequence_errors.previous}
                            total_pages={data.sequence_errors.total_pages}
                          />
                        </>
                      ) : (
                        <div className="mx-auto text-muted-foreground">
                          No se encontraron registros repetidos
                        </div>
                      )}
                    </TableBody>
                  </Table>
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

export function Paginacion({
  prevUrl,
  nextUrl,
  total_pages,
  currentPage,
}: {
  prevUrl: string | null;
  nextUrl: string | null;
  total_pages: number;
  currentPage: number;
}) {
  const { handleNextPrevPage } = usePagination();
  const pages_to_show = 10;
  const sRange =
    currentPage > total_pages - pages_to_show
      ? Math.max(1, total_pages - pages_to_show + 1)
      : Math.max(1, currentPage, currentPage - pages_to_show);
  const eRange = Math.min(total_pages, currentPage + pages_to_show);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => handleNextPrevPage(prevUrl)}
            isActive={prevUrl !== null}
          />
        </PaginationItem>
        {sRange > 1 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {Array.from({ length: eRange - sRange + 1 }, (_, i) => i + sRange).map(
          (page) => {
            return (
              <PaginationItem key={page}>
                <PaginationLink
                  className="cursor-pointer"
                  isActive={page === currentPage}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          }
        )}
        {eRange < total_pages && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationNext
            onClick={() => handleNextPrevPage(nextUrl)}
            isActive={nextUrl !== null}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
