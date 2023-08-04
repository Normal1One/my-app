import { verifyJwt } from '@/lib/jwt'
import { prisma } from '@/lib/prismadb'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (
    request: NextRequest,
    { params }: { params: { id: string } }
) => {
    const accessToken = request.headers.get('authorization')

    if (!accessToken || !verifyJwt(accessToken)) {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    const user = await prisma.user.findUnique({
        where: { id: params.id }
    })

    if (!user) {
        return new NextResponse('No user found', { status: 404 })
    }

    const { hashedPassword, ...result } = user
    return new NextResponse(JSON.stringify(result))
}
