/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            'lh3.googleusercontent.com',
            'avatars.githubusercontent.com',
            'pbs.twimg.com',
        ],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*.supabase.co'
            }
        ]
    }
}

module.exports = nextConfig
