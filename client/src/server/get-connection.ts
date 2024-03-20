import { API_COOKIES } from "@/constants/cookies";
import { API_HOST } from "@/constants/server";
import axios from "axios";
import { getToken } from "./token";
import { ConnectionProvider } from "@/providers/connection";
import { cache } from "react";

async function fetchLastConnection() {
    try {
        const lastConnection = await axios.get(`${API_HOST}/aud/get/last`, {
            headers: {
                Cookie: `${API_COOKIES}=${getToken()?.value}`
            }
        })
    
        return lastConnection.data as ConnectionProvider
    } catch(e) {
        return {
            engine: "sqlserver",
            name: "",
            host: "localhost",
            port: 1433,
            username: "sa",
            id: 0
        } as ConnectionProvider
    }
}

export const getLastConnection = cache(fetchLastConnection)