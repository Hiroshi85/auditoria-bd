import IntegridadCamposForm from "./partials/form"

import { Metadata } from "next"

export const metadata: Metadata = {
    title: 'Integridad Campos - Database Auditor',
}

export default async function Page() {
    return <>
        <IntegridadCamposForm />
    </>
}