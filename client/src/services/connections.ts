import { API_HOST } from "@/constants/server";
import axios from "axios";
import { Connection } from "@/types/connection";

export async function getAllConnections(): Promise<Connection[]> {
    try {
        const res = await axios.get(`${API_HOST}/aud/get/all`, {
            withCredentials: true,
        })

        const connections = res.data.connections as Connection[]
        return connections

    } catch (e) {
        return []
    }
}

export async function getTablesOfConnection(connectionId: number): Promise<string[]> {
    try {
        const res = await axios.get(`${API_HOST}/aud/connection/${connectionId}/tables`, {
            withCredentials: true,
        })

        const tables = res.data.tables as string[]
        return tables

    } catch (e) {
        return []
    }
}