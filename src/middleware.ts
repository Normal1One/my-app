import { withAuth } from 'next-auth/middleware'

export default withAuth({
    callbacks: {
        authorized: ({ token, req }) => {
            if (req.nextUrl.pathname === '/update-password') {
                return ['credentials', 'email'].includes(
                    token?.provider as string
                )
            }
            return !!token
        }
    }
})

export const config = {
    matcher: ['/users/:path*', '/liked', '/update', '/update-password']
}
