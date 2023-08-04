import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { auth: { persistSession: false } }
)

export const uploadFile = async (file: File) => {
    const { data, error } = await supabase.storage
        .from('avatars')
        .upload(uuidv4(), file, {
            cacheControl: '3600',
            upsert: false
        })
    return { data, error }
}

export const getFileURL = (path: string) => {
    const { data } = supabase.storage.from('avatars').getPublicUrl(path)
    return data
}
