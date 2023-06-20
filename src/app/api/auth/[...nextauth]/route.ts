import NextAuth from 'next-auth/next';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import EmailProvider from 'next-auth/providers/email';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { Adapter } from 'next-auth/adapters';
import { prisma } from '@/lib/prismadb';

const handler = NextAuth({
    adapter: <Adapter>PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: <string>process.env.GOOGLE_ID,
            clientSecret: <string>process.env.GOOGLE_SECRET,
        }),
        GithubProvider({
            clientId: <string>process.env.GITHUB_ID,
            clientSecret: <string>process.env.GITHUB_SECRET,
        }),
        EmailProvider({
            server: <string>process.env.EMAIL_SERVER,
            from: <string>process.env.EMAIL_FROM,
        }),
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                const response = await fetch(
                    `${process.env.NEXTAUTH_URL}/api/login`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            email: credentials?.email,
                            password: credentials?.password,
                        }),
                    }
                );

                const user = await response.json();

                if (user) {
                    return user;
                } else {
                    return null;
                }
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/auth/login',
    },
});

export { handler as GET, handler as POST };
