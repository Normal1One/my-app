'use server'

import axios from './axios'
import { AuthGetApi } from './fetchAPI'

interface Props {
    take?: number
    lastCursor?: string
    userId?: string
}

export const getAllPosts = async ({ take, lastCursor }: Props) => {
    const response = await axios.get('api/posts', {
        params: {
            take,
            lastCursor
        }
    })
    return response?.data
}

export const getPostsByAuthor = async ({ take, lastCursor, userId }: Props) => {
    const response = await axios.get(`api/users/${userId}/posts`, {
        params: {
            take,
            lastCursor
        }
    })
    return response?.data
}

export const getLikedPosts = async ({ take, lastCursor }: Props) => {
    return await AuthGetApi(
        `api/posts/liked?take=${take}?lastCursor=${lastCursor}`
    )
}
