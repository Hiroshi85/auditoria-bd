"use server"

import { API_HOST } from "@/constants/server";
import { VerificarIntegridadDeCamposRequest } from "@/types/excepciones/integridad/campo";

export async function verificarIntegridadDeCamposRequest(data: VerificarIntegridadDeCamposRequest) {

    try {
        const response = await fetch(`${API_HOST}/exceptions/integridad/campo`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })

        if (!response.ok) {
            return {
                error: response.statusText,
                data: null
            }
        }

        const json = await response.json()

        return {
            error: null,
            data: json
        }

    } catch (e) {
        return {
            error: "Error verificando integridad de campos",
            data: null
        }
    }



}