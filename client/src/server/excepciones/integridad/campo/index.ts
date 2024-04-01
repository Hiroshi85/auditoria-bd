"use server"

import { API_COOKIES } from "@/constants/cookies";
import { API_HOST } from "@/constants/server";
import { ensureError } from "@/lib/errors";
import { getToken } from "@/server/token";
import { VerificarIntegridadDeCamposRequest, VerificarIntegridadDeCamposResponse } from "@/types/excepciones/integridad/campo";

export async function verificarIntegridadDeCamposRequest(data: VerificarIntegridadDeCamposRequest): Promise<VerificarIntegridadDeCamposResponse> {

    try {
        console.log(data)
        const response = await fetch(`${API_HOST}/exceptions/db/${data.connectionId}/fields`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Cookie: `${API_COOKIES}=${getToken()?.value}`

            },
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
        const error = ensureError(e)
        return {
            error: "Error verificando integridad de campos. " + error.message,
            data: null
        }
    }



}