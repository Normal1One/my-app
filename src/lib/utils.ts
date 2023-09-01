import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { auth: { persistSession: false } }
)

export const uploadFile = async (file: File) => {
    if (file) {
        const { data, error } = await supabase.storage
            .from('avatars')
            .upload(uuidv4(), file)

        if (data)
            return supabase.storage.from('avatars').getPublicUrl(data.path)
    }
}
