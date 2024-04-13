import { API_HOST } from "@/constants/server";
import { ensureError } from "@/lib/errors";
import { GetResultadosResponse } from "@/types/resultados";
import axios from "axios";

export async function getResultados(): Promise<GetResultadosResponse> {

    try {
        const response = await axios.get(`${API_HOST}/aud/results`,
            {
                withCredentials: true
            }
        )

        if (response.status > 200) {
            return {
                error: response.statusText,
                data: null
            }
        }

        const json = await response.data

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