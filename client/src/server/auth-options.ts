import { API_COOKIES } from '@/constants/cookies';
import { API_HOST } from '@/constants/server';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '@/types/auth/auth';
import { AuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { cookies } from 'next/headers';

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            id: 'login',
            name: 'login',
            credentials: {
                username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials, req) {
                const LoginRequest: LoginRequest = {
                    username: credentials?.username || "",
                    password: credentials?.password || ""
                }

                var response: Response = new Response();
                try{
                    response = await fetch(`${API_HOST}/auth/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(LoginRequest)
                    })
                } catch(e) {
                    console.log(e)
                }

                if (!response.ok) {
                    return null;
                }

                const body: LoginResponse = await response.json()

                cookies().set(API_COOKIES, body.token, {
                    secure: true,
                    path: '/',
                    maxAge: 60 * 60 * 24,
                    httpOnly: true,
                    expires: new Date(Date.now() + 60 * 60 * 24 * 1000)
                })

                return {
                    id: String(body.id),
                    name: body.username,
                    email: body.email,
                    image: 'https://www.gravatar.com/avatar/',

                }
            },
        }),
    ],
    pages: {
        signIn: '/login',
        newUser: '/register',
    },
    session: {
        strategy: 'jwt',
        maxAge: 21600 // 6 hours
    },
    jwt: {
        maxAge: 21600 // 6 hours
    },
    callbacks: {
        jwt: async ({token, user, account, profile}) => {
            // if (user) {
            //     token.roles = user.roles
            //     token.permissions = user.permissions
            // }
            return token
        },
        // async session({session, token, user}) {
        //     session.user.email = token.email
        //     session.user.name = token.name as string  
        //     session.user.image = token.picture as string
        //     session.user.roles = token.roles as string[]
        //     session.user.permissions = token.permissions as string[]


        //     return session
        // },
        
    },
}