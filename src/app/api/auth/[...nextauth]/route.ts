import NextAuth from 'next-auth/next';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { Adapter } from 'next-auth/adapters';
import { prisma } from '@/lib/prismadb';
import axios from 'axios';

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
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                const response = await axios.post(
                    'http://localhost:3000/api/login',
                    JSON.stringify({
                        email: credentials?.email,
                        password: credentials?.password,
                    })
                );

                const user = response.data;

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
