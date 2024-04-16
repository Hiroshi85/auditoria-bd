"use client";
import { DataTable } from "@/components/layout/table/table-details";
import { VerificarIntegridadDeCamposResponse } from "@/types/excepciones/integridad/campo";
import React from "react";
import { columns } from "./columns";
import { useCamposContext } from "../campos.context";
import { ResultContainer } from "@/components/ui/result-container";
import { Spinner } from "@/components/ui/spinner";
import { Condicion } from "./conditions";
import { obtenerStringDeCondicion } from "@/helpers/condiciones";
import { Badge } from "@/components/ui/badge";
import Alertas from "@/components/alertas";



const IntegridadCamposResults = () => {
  const { mutation } = useCamposContext();
  const { data, isPending, isError } = mutation;

  if (isPending) {
    return (
      <ResultContainer className="grid place-content-center w-full py-5">
        <p className="text-accent text-center">
          <Spinner />
        </p>
      </ResultContainer>
    );
  }

  if (isError) {
    return (
      <ResultContainer type="error" className="w-full py-5">
        <p className="text-red-500 text-center">
          Error al cargar los resultados
        </p>
      </ResultContainer>
    );
  }

  if (!data) {
    return (
      <ResultContainer className="w-full py-5">
        <p className="text-center">
          Aquí se mostrarán los resultados de la ejecución
        </p>
      </ResultContainer>
    );
  }

  if (data.error) {
    return (
      <ResultContainer type={"error"} className="w-full py-5">
        <p className="text-red-500 text-center">{data.error}</p>
      </ResultContainer>
    );
  }

  return (
    <section className="flex flex-col gap-3 w-full my-5">
      {/* {JSON.stringify(data.data)} */}
      <h3 className="text-xl font-medium">Resultados</h3>
      <ResultContainer
        type={data.data && data.data.num_rows_exceptions > 0 ? "error" : "ok"}
        className="md:rounded-md bg-accent p-5 flex flex-col gap-3"
      >
        <div className="flex flex-wrap justify-between [&>div]:flex [&>div]:flex-wrap [&>div]:gap-x-3">
          <div>
            <span className="font-bold">Base de datos:</span>
            <span>{data.data?.database}</span>
          </div>
          <div>
            <span className="font-bold">Fecha Y Hora :</span>
            <span>{data.data?.accessed_on}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <span className="font-bold">Tabla:</span>
          <span>{data.data?.table}</span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-bold">Condiciones</span>
          <div className="flex gap-4 overflow-x-scroll overflow-hidden snap-x pb-2"
            style={{ scrollbarWidth: "thin" }}
          >
            {
              data && data.data && data.data.conditions &&
              Object.keys(data.data.conditions).map((key) => {
                const condicion = data.data?.conditions[key];
                if (!condicion) return null;
                return (
                  <Condicion
                    key={key}
                    columna={key}
                    condiciones={condicion.map((c) => obtenerStringDeCondicion(c))}
                  />
                );
              }
              )}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold bg-primary rounded-lg py-2 px-2 text-white relative">
            Detalles del análisis
            <Badge
              variant={data && data.data && data.data.num_rows_exceptions > 0 ? "destructive" : "outline"}
              className="text-white absolute right-2 top-3"
            >
              {data.data && data.data.num_rows_exceptions > 0
                ? "Campos no integros"
                : "Campos integros"}
            </Badge>
          </h2>
          {data.data && data.data.num_rows_exceptions > 0 && <Alertas tipoExcepcion="De Campos" />
          }
        </div>
        {data.data && data.data.num_rows_exceptions > 0 && (
          <>
            <p
              className="font-medium"
            >
              Excepciones: {data.data.num_rows_exceptions}
            </p>
            <DataTable
              columns={columns(data.data.results)}
              data={data.data.results}
            />
          </>
        )}
        {data.data && data.data.num_rows_exceptions === 0 && (
          <p>No se encontraron excepciones</p>
        )}
      </ResultContainer>
    </section>
  );
};

export default IntegridadCamposResults;
