import { verifyJwt } from '@/lib/jwt';
import { prisma } from '@/lib/prismadb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const accessToken = request.headers.get('accessToken');

    if (!accessToken || !verifyJwt(accessToken)) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { id: params.id },
    });

    if (!user) {
        return new NextResponse('No user found', { status: 404 });
    }

    return new Response(JSON.stringify(user));
}
