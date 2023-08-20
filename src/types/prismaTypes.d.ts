import { Prisma } from '@prisma/client'

export type PostWithAuthor = Prisma.PostGetPayload<{
    include: {
        author: {
            select: {
                name: true
                image: true
            }
        }
    }
}>
