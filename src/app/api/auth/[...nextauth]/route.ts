import NextAuth from 'next-auth/next'
import GoogleProvider from 'next-auth/providers/google'
import GithubProvider from 'next-auth/providers/github'
import TwitterProvider from 'next-auth/providers/twitter'
import EmailProvider from 'next-auth/providers/email'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { Adapter } from 'next-auth/adapters'
import { prisma } from '@/lib/prismadb'
import axios from 'axios'
import { NextAuthOptions } from 'next-auth'
import { signJwtAccessToken } from '@/lib/jwt'
import { User } from '@prisma/client'

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
                    `${process.env.NEXTAUTH_URL}/api/login`,
                    JSON.stringify({
                        email: credentials?.email,
                        password: credentials?.password
                    })
                )

                return response.data || null
            }
        })
    ],
    pages: {
        signIn: '/sign-in'
    },
    session: {
        strategy: 'jwt'
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, user, account }) {
            if (account) {
                const { hashedPassword, ...result } = user as User
                const accessToken = signJwtAccessToken(result)
                return { ...token, accessToken }
            }
            return { ...token, ...user }
        },
        async session({ session, token }) {
            session.user = token as any
            return session
        }
    }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
