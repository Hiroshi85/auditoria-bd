"use server"

import { API_COOKIES } from "@/constants/cookies";
import { API_HOST } from "@/constants/server";
import { RegisterRequest, RegisterResponse } from "@/types/auth/auth";
import { cookies } from "next/headers";

export async function register(data: RegisterRequest) {
    
    try{
        const response = await fetch(`${API_HOST}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
    
        const user: RegisterResponse = await response.json()

        if (user.username == "A user with that username already exists.") {
            return {
                error: "El nombre de usuario ya existe",
                data: null
            }
        }

        return {
            error: null,
            data: user
        }

    } catch(e) {
        return {
            error: "no se pudo iniciar sesion",
            data: null
        }
    }



}