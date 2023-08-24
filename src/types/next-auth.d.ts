import { DefaultUser } from 'next-auth'
import { DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
    interface Session {
        user: DefaultUser & {
            accessToken: string
            refreshToken: string
            type: string
            emailVerified: string
        }
    }

    interface DefaultJWT {
        JWT: DefaultJWT & {
            type: string
        }
    }
}
