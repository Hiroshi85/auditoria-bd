'use client'
import Alertas from '@/components/alertas'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ResultsTablas } from '@/types/resultados'
import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'
type Props = {
    data: ResultsTablas
}
const ResultadoTablas = (
    { data }: Props
) => {
    return (
        <AnimatePresence>
            <motion.div
                className='mx-auto'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h2 className="text-xl font-semibold">Resultados</h2>
                <div className="mt-2 rounded-md bg-accent py-3 px-5">
                    <div>
                        <p className="text-lg mb-5"><span className="font-semibold">Tabla: </span>{data.table}</p>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold bg-primary rounded-lg py-2 px-2 text-white relative">
                            Detalles del análisis
                            <Badge
                                variant={data.results[0].results.length > 0 ? "destructive" : "outline"}
                                className="text-white absolute right-2 top-3"
                            >
                                {data.results[0].results.length > 0
                                    ? "Falla en la integridad"
                                    : "No falla en la integridad"}
                            </Badge>
                        </h2>
                        {data.results[0].results.length > 0 && <Alertas tipoExcepcion="De Tabla" />
                        }
                    </div>

                    <div>
                        {
                            data.results.map((detail, index) => (
                                <div key={index} className="mt-3">
                                    <h3>Verificación de integridad con la tabla <span className="font-semibold">{detail.foreing_table}</span></h3>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>PK</TableHead>
                                                <TableHead>{detail.column} / {detail.foreing_column}</TableHead>
                                                <TableHead>{detail.foreing_column} de {detail.foreing_table}</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {
                                                detail.results.map((result, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>{result.primary_key}</TableCell>
                                                        <TableCell>{String(result.foreign_key)}</TableCell>
                                                        <TableCell>{String(result.table_foreign_key)}</TableCell>
                                                    </TableRow>
                                                ))
                                            }
                                        </TableBody>
                                    </Table>

                                </div>
                            ))
                        }

                    </div>

                </div>


            </motion.div>
        </AnimatePresence>
    )
}

export default ResultadoTablas