import { Client, Storage, ID } from 'appwrite'

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_PROJECT_ID)

const storage = new Storage(client)

export const uploadFile = async (file: File) => {
    return await storage.createFile(
        process.env.APPWRITE_BUCKET_ID,
        ID.unique(),
        file
    )
}

export const getFile = (id: string) => {
    return storage.getFileView(process.env.APPWRITE_BUCKET_ID, id).toString()
}
