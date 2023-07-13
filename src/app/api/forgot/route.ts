import { prisma } from '@/lib/prismadb'
import { sendEmail } from '@/lib/sendMail'
import jwt from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'

export const POST = async (request: NextRequest) => {
    const body = await request.json()
    const { email } = body

    if (!email) {
        return new NextResponse('Missing fields', { status: 400 })
    }

    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if (!user || !user?.hashedPassword) {
        return new NextResponse('No user found', { status: 404 })
    }

    const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY!, {
        expiresIn: '24h'
    })

    await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            resetToken: token
        }
    })

    const link = `${process.env.NEXTAUTH_URL}/reset/${token}`

    const message = `<div>Click on the link below to reset your password.</div></br><div>${link}</div>`

    sendEmail({
        to: email,
        subject: 'Password Reset',
        text: message
    })

    return new NextResponse(
        `Email sent to ${user.email}, please check your email`,
        { status: 200 }
    )
}
