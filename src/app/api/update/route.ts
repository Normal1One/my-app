import { verifyJwt } from '@/lib/jwt'
import { prisma } from '@/lib/prismadb'
import { getFileURL, uploadFile } from '@/lib/utils'
import { JwtPayload } from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'

export const PATCH = async (request: NextRequest) => {
    const body = await request.formData()

    const accessToken = request.headers.get('authorization')

    if (!accessToken || !verifyJwt(accessToken)) {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    const { id } = verifyJwt(accessToken) as JwtPayload

    const exist = await prisma.user.findUnique({
        where: {
            id
        }
    })

    if (!exist) {
        return new NextResponse('No user found', { status: 404 })
    }

    const getImage = async (file: File) => {
        if (file) {
            try {
                const response = await uploadFile(file)
                return getFileURL(response.data?.path as string).publicUrl
            } catch (error) {
                return new NextResponse('Error while uploading file', {
                    status: 400
                })
            }
        }
    }

    const user = await prisma.user.update({
        where: {
            id
        },
        data: {
            name: (body.get('name') as string) ?? undefined,
            email: (body.get('email') as string) ?? undefined,
            image:
                ((await getImage(body.get('file') as File)) as string) ??
                undefined
        }
    })

    const { hashedPassword, ...result } = user
    return new NextResponse(JSON.stringify(result))
}
