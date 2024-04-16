import { Metadata } from 'next';
import React from 'react'
import Resultado from './partials/resultado';

export const metadata: Metadata = {
    title: 'Resultado - Database Auditor',
};


export default function ResultadoPage() {
    return (
        <section className='container'>
            <Resultado />
        </section>
    )
}
