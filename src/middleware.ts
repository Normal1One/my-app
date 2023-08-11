import { withAuth } from 'next-auth/middleware'

export default withAuth({
    callbacks: {
        authorized: ({ token, req }) => {
            if (req.nextUrl.pathname === '/update-password') {
                return (
                    token?.provider === 'credentials' ||
                    token?.provider === 'email'
                )
            }
            return !!token
        }
    }
})

export const config = {
    matcher: ['/users/:path*', '/update', '/update-password']
}
