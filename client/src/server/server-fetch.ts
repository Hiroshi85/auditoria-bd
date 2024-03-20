import { API_COOKIES } from "@/constants/cookies";
import axios, { AxiosRequestConfig } from "axios";
import { getToken } from "./token";

export async function fetcheServer(url: string, config?: AxiosRequestConfig<any> | undefined) {
    return axios.get(url, {
        ...config,
        headers: {
            ...config?.headers,
            Cookie: `${API_COOKIES}=${getToken()?.value}`
        }
    })
}