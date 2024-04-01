import { DataTable } from '@/components/layout/table/table-details'
import { VerificarIntegridadDeCamposResponse } from '@/types/excepciones/integridad/campo'
import React from 'react'
import { columns } from './columns'
interface Props {
    response: VerificarIntegridadDeCamposResponse
}
const IntegridadCamposResults = ({ response }: Props) => {

    if (response.error) {
        return (
            <div className='w-full py-5'>
                <p
                    className='text-red-500 text-center'
                >
                    {response.error}
                </p>
            </div>
        )
    }


    return (
        <section className='flex flex-col gap-3 w-full my-5'>
            {JSON.stringify(response.data)}
            <h3
                className='text-xl font-medium'>Resultados</h3>
            <div
                className='md:rounded-md bg-accent p-5 flex flex-col gap-3'
            >
                <div className='grid grid-cols-2'>
                    <div className='flex gap-3'>
                        <span className='font-bold'>Base de datos:</span>
                        <span>{response.data?.table}</span>
                    </div>
                    <div className='flex gap-3'>
                        <span className='font-bold'>Fecha Y Hora :</span>
                        <span>{new Date().toLocaleString()}</span>
                    </div>
                    <div className='flex gap-3'>
                        <span className='font-bold'>Tabla:</span>
                        <span>{response.data?.table}</span>
                    </div>
                </div>
                <div>
                    <span className='font-bold'>Condiciones</span>
                    <div></div>
                </div>
                {response.data && response.data.num_rows_exceptions > 0 && <DataTable columns={columns(response.data.results)} data={response.data.results} />}
                {response.data && response.data.num_rows_exceptions === 0 && <p>No se encontraron excepciones</p>}

            </div>
        </section>
    )
}

export default IntegridadCamposResults