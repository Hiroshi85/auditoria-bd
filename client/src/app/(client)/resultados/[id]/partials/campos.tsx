'use client'
import { ResultContainer } from '@/components/ui/result-container'
import { ResultsCampos } from '@/types/resultados'
import { DataTable } from "@/components/layout/table/table-details";
import { columns } from '@/app/(client)/integridad/campos/partials/columns'
import React from 'react'
import { Condicion } from '@/app/(client)/integridad/campos/partials/conditions';
import { obtenerStringDeCondicion } from '@/helpers/condiciones';
import { Badge } from '@/components/ui/badge';
import Alertas from '@/components/alertas';
type Props = {
    data: ResultsCampos
}
const ResultadoCampos = (
    { data }: Props
) => {
    return (
        <section className="mx-auto flex flex-col gap-3 w-full my-5">
            {/* {JSON.stringify(data)} */}
            <h3 className="text-xl font-medium">Resultados</h3>
            <ResultContainer
                type={data && data.num_rows_exceptions > 0 ? "error" : "ok"}
                className="md:rounded-md bg-accent p-5 flex flex-col gap-3"
            >
                <div className="flex flex-wrap justify-between [&>div]:flex [&>div]:flex-wrap [&>div]:gap-x-3">
                    <div>
                        <span className="font-bold">Base de datos:</span>
                        <span>{data.database}</span>
                    </div>
                    <div>
                        <span className="font-bold">Fecha Y Hora :</span>
                        <span>{data.accessed_on}</span>
                    </div>
                </div>
                <div className="flex flex-wrap gap-3">
                    <span className="font-bold">Tabla:</span>
                    <span>{data.table}</span>
                </div>
                <div className="flex flex-col gap-2">
                    <span className="font-bold">Condiciones</span>
                    <div className="flex gap-4 overflow-x-scroll overflow-hidden snap-x pb-2"
                        style={{ scrollbarWidth: "thin" }}
                    >
                        {
                            data && data && data.conditions &&
                            Object.keys(data.conditions).map((key) => {
                                const condicion = data.conditions[key];
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
                            variant={data && data.num_rows_exceptions > 0 ? "destructive" : "outline"}
                            className="text-white absolute right-2 top-3"
                        >
                            {data.num_rows_exceptions > 0
                                ? "Campos no integros"
                                : "Campos integros"}
                        </Badge>
                    </h2>
                    {data.num_rows_exceptions > 0 && <Alertas tipoExcepcion="De Campos" />
                    }
                </div>
                {data && data.num_rows_exceptions > 0 && (
                    <>
                        <p
                            className="font-medium"
                        >
                            Excepciones: {data.num_rows_exceptions}
                        </p>
                        <DataTable
                            columns={columns(data.results)}
                            data={data.results}
                        />
                    </>
                )}
                {data && data.num_rows_exceptions === 0 && (
                    <p>No se encontraron excepciones</p>
                )}
            </ResultContainer>
        </section>
    )
}

export default ResultadoCampos