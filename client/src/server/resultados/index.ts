"use server"

import { API_COOKIES } from "@/constants/cookies";
import { API_HOST } from "@/constants/server";
import { ensureError } from "@/lib/errors";
import { getToken } from "@/server/token";
import { GetResultadosResponse } from "@/types/resultados";

export async function getResultados(): Promise<GetResultadosResponse> {

    try {
        const response = await fetch(`${API_HOST}/aud/results`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Cookie: `${API_COOKIES}=${getToken()?.value}`

            },
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