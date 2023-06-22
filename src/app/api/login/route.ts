import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prismadb';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
        return new NextResponse('Missing fields', { status: 400 });
    }

    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (!user || !user?.hashedPassword) {
        throw new Error('No user found');
    }

    const passwordMatch = await bcrypt.compare(password, user.hashedPassword);

    if (!passwordMatch) {
        throw new Error('Incorrect password');
    }

    const { hashedPassword, ...result } = user;
    return new Response(JSON.stringify(result));
}
