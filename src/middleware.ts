import { withAuth } from 'next-auth/middleware'

export default withAuth({
    callbacks: {
        authorized: ({ token, req }) =>
            !(
                token?.provider !== 'credentials' &&
                token?.provider !== 'email' &&
                req.nextUrl.pathname === '/update-password'
            )
    }
})

export const config = {
    matcher: ['/users/:path*', '/update', '/update-password']
}
