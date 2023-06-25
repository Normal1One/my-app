import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prismadb';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
        return new NextResponse('Missing fields', { status: 400 });
    }

    const exist = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (exist) {
        throw new NextResponse('Email already exists', { status: 409 });
    }

    const user = await prisma.user.create({
        data: {
            name,
            email,
            hashedPassword: await bcrypt.hash(password, 10),
        },
    });

    const { hashedPassword, ...result } = user;
    return new Response(JSON.stringify(result));
}
