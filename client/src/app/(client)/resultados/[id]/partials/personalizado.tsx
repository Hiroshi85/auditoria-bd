'use client'
import { DataTable } from '@/components/layout/table/table-details'
import { Button } from '@/components/ui/button'
import { ResultContainer } from '@/components/ui/result-container'
import { ResultsPersonalizadas } from '@/types/resultados'
import { Table2Icon } from 'lucide-react'
import React from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { revalidatePath } from 'next/cache'
import nextAppLoader from 'next/dist/build/webpack/loaders/next-app-loader'
import usePagination from '@/hooks/results/pagination'

type Props = {
    data: ResultsPersonalizadas
}

const ResultadoPersonalizado = (
    { data }: Props
) => {
    const { handleNextPrevPage } = usePagination()

    return (
        <div className='mx-auto'>
            <div className='my-5'>
                <h2 className="text-xl font-semibold">Resultados</h2>
                <div>
                    <h3
                        className="italic"
                    >{data.name}</h3>
                    <pre
                        className='w-full bg-white rounded-md px-4 py-2 font-mono text-muted-foreground'
                    >
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
                        onClick={() => handleNextPrevPage(data.rows.previous)}
                        disabled={data.rows.previous === null}
                    >
                        Anterior
                    </Button>
                    <Button
                        variant={"outline"}
                        onClick={() => handleNextPrevPage(data.rows.next)}
                        disabled={data.rows.next === null}
                    >
                        Siguiente
                    </Button>
                </footer>
            </ResultContainer>
        </div>
    );
}

export default ResultadoPersonalizado