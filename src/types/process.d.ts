declare namespace NodeJS {
    export interface ProcessEnv {
        GITHUB_ID: string
        GITHUB_SECRET: string
        TWITTER_CLIENT_ID: string
        TWITTER_CLIENT_SECRET: string
        GOOGLE_ID: string
        GOOGLE_SECRET: string
        EMAIL_SERVER_PORT: number
        NEXT_PUBLIC_SUPABASE_URL: string
        NEXT_PUBLIC_SUPABASE_ANON_KEY: string
    }
}
