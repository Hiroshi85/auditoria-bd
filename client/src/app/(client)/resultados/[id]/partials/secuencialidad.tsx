'use client'
import { Badge } from '@/components/ui/badge'
import { ResultContainer } from '@/components/ui/result-container'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { ResultsSecuencial } from '@/types/resultados'
import { InfoIcon } from 'lucide-react'
import React from 'react'

function getTabColor(array: any[]) {
    return array.length > 0 && "text-red-600";
}

type Props = {
    data: ResultsSecuencial
}
const ResultadoSecuencialidad = (
    { data }: Props
) => {
    return (
        <div className='container mx-auto'>
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
                        <main>
                            <Tabs defaultValue="missing">
                                <TabsList className="w-full mb-4 space-x-2 bg-transparent">
                                    <TabsTrigger
                                        value="missing"
                                        className={cn(getTabColor(data.missing.data))}
                                    >{`Registros faltantes ${data.num_missing}`}</TabsTrigger>
                                    <TabsTrigger
                                        value="repeated"
                                        className={cn(getTabColor(data.duplicates.data))}
                                    >{`Registros repeditos ${data.num_duplicates}`}</TabsTrigger>
                                    <TabsTrigger
                                        value="errors"
                                        className={cn(getTabColor(data.sequence_errors.data))}
                                    >{`Errores de secuencia ${data.num_sequence_errors}`}</TabsTrigger>
                                </TabsList>
                                <TabsContent
                                    value="missing"
                                    className="flex flex-wrap gap-x-8 gap-y-8"
                                >
                                    {data.missing.data.map((item, index) => {
                                        return (
                                            <span key={item} className={"min-w-[60px]"}>
                                                {item}
                                            </span>
                                        );
                                    })}
                                </TabsContent>
                                <TabsContent
                                    value="repeated"
                                    className="flex flex-wrap gap-x-8 gap-y-8"
                                >
                                    {data.duplicates.data.map((item) => {
                                        return (
                                            <span key={item} className={"min-w-[60px]"}>
                                                {item}
                                            </span>
                                        );
                                    })}
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
                                            {data.sequence_errors.data.map((item, index) => {
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
                                </TabsContent>
                            </Tabs>
                        </main>
                    )}
                </ResultContainer>
            )}
        </div>
    )
}

export default ResultadoSecuencialidad