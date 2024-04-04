import { API_COOKIES } from "@/constants/cookies";
import { API_HOST } from "@/constants/server";
import axios from "axios";
import { getToken } from "./token";
import { Connection } from "@/types/connection";

export async function getAllConnections(): Promise<Connection[]> {
    try {
        const res = await axios.get(`${API_HOST}/aud/get/all`, {
            headers: {
                Cookie: `${API_COOKIES}=${getToken()?.value}`
            }
        })

        const connections = res.data.connections as Connection[]
        return connections

    } catch (e) {
        return []
    }
}