import axios from 'axios'
import { NextRequest, NextResponse } from 'next/server'
import { validityStateUser } from './lib/tokenHelper'

const middleware = async (request: NextRequest) => {
    if (!request.nextUrl.pathname.startsWith('/login')) {
        let token = request.cookies.get("token")
        let isValidUser = await validityStateUser(request, token)
        if (!isValidUser) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }
    return NextResponse.next()
}

export const config = {
    matcher: ['/', '/login'],
}

export default middleware