import { API_COOKIES } from "@/constants/cookies";
import { API_HOST } from "@/constants/server";
import axios from "axios";

type Props = {
    connectionId: number
    token: string
}
export async function getTablesOfConnection(
    { connectionId, token }: Props
): Promise<string[]> {
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