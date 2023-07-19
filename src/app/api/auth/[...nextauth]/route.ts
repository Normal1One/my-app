import axios from '@/lib/axios'
import { signJwtAccessToken } from '@/lib/jwt'
import { prisma } from '@/lib/prismadb'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { User } from '@prisma/client'
import { NextAuthOptions } from 'next-auth'
import { Adapter } from 'next-auth/adapters'
import NextAuth from 'next-auth/next'
import CredentialsProvider from 'next-auth/providers/credentials'
import EmailProvider from 'next-auth/providers/email'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import TwitterProvider from 'next-auth/providers/twitter'

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma) as Adapter,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET
        }),
        TwitterProvider({
            clientId: process.env.TWITTER_CLIENT_ID,
            clientSecret: process.env.TWITTER_CLIENT_SECRET
        }),
        EmailProvider({
            server: {
                host: process.env.EMAIL_SERVER_HOST,
                port: process.env.EMAIL_SERVER_PORT,
                auth: {
                    user: process.env.EMAIL_SERVER_USER,
                    pass: process.env.EMAIL_SERVER_PASSWORD
                }
            },
            from: process.env.EMAIL_FROM
        }),
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                const response = await axios.post(
                    `${process.env.NEXTAUTH_URL}/api/sign-in`,
                    JSON.stringify({
                        email: credentials?.email,
                        password: credentials?.password
                    })
                )

                const user = response.data

                if (user.ok && user) {
                    return user
                }

                return null
            }
        })
    ],
    pages: {
        signIn: '/sign-in'
    },
    session: {
        strategy: 'jwt'
    },
    // secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, user, account }) {
            if (account) {
                const { hashedPassword, ...result } = user as User
                const { accessToken, refreshToken } = signJwtAccessToken(result)
                return { ...user, ...token, accessToken, refreshToken }
            }
            return { ...user, ...token }
        },
        async session({ session, token }) {
            session.user = token as any
            return session
        }
    }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
