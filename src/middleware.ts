import { withAuth } from 'next-auth/middleware'

export default withAuth({
    callbacks: {
        authorized: ({ token, req }) => {
            if (req.nextUrl.pathname === '/update-password') {
                return token?.type !== 'oauth'
            }
            return !!token
        }
    }
})

export const config = {
    matcher: ['/users/:path*', '/liked', '/update', '/update-password']
}
