import { API_COOKIES } from "@/constants/cookies";
import { cookies } from "next/headers";

export function getToken() {
    return cookies().get(API_COOKIES)
}