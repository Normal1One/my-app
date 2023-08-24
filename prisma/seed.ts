import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

const main = async () => {
    const user = await prisma.user.create({
        data: {
            name: faker.person.fullName(),
            email: faker.internet.email(),
            hashedPassword: await bcrypt.hash(faker.internet.password(), 10),
            emailVerified: new Date()
        }
    })

    const createRandomPost = () => {
        return {
            authorId: user.id,
            title: faker.lorem.sentence(),
            subtitle: faker.lorem.sentence(),
            text: faker.lorem.paragraphs()
        }
    }

    const posts = faker.helpers.multiple(createRandomPost, { count: 30 })

    await prisma.post.createMany({ data: posts })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
