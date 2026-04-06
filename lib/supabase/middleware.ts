import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const AUTH_ROUTES = ['/auth/login', '/auth/sign-up']
const AUTH_PREFIX = '/auth'
const COURSES_ROUTE = '/courses'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const { data } = await supabase.auth.getClaims()
    const user = data?.claims
    const { pathname } = request.nextUrl

    if (!user) {
        if (pathname === '/') {
            const url = request.nextUrl.clone()
            url.pathname = '/auth/login'
            return NextResponse.redirect(url)
        }

        if (!pathname.startsWith(AUTH_PREFIX)) {
            const url = request.nextUrl.clone()
            url.pathname = '/auth/login'
            return NextResponse.redirect(url)
        }

        return supabaseResponse
    }

    if (user) {
        if (pathname === '/') {
            const url = request.nextUrl.clone()
            url.pathname = COURSES_ROUTE
            return NextResponse.redirect(url)
        }

        if (AUTH_ROUTES.some((route) => pathname === route)) {
            const url = request.nextUrl.clone()
            url.pathname = COURSES_ROUTE
            return NextResponse.redirect(url)
        }
    }

    return supabaseResponse
}
