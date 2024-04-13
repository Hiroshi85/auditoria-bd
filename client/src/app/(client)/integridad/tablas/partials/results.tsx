"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useTableException } from "./context"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"


export default function ResultTableException() {
    const exception = useTableException()
    const { data, isPending, isError } = exception.mutation

    if (isPending) {
        return <p>Loading...</p>
    }

    if (isError) {
        return <p>Error loading results</p>
    }

    if (!data) {
        return <p>Here will be the results</p>
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h2 className="text-xl font-semibold">Resultados</h2>
                <div className="mt-2 rounded-md bg-accent py-3 px-5">
                    <div>
                        <p className="text-lg"><span className="font-semibold">Tabla: </span>{data.table}</p>
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