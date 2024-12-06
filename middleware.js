import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import Cookies from "js-cookie";

const SECRET_KEY = process.env.JWT_SECRET;

export async function middleware(req) {
    // const token = cookies().get('token')?.value;
    // const token = Cookies.get('token');
   
    // const response = NextResponse.next();
    // response.headers.set('Cache-Control', 'no-store');

    // if (!token) {
    //     console.log('No token found. Redirecting to /login');
    //     return NextResponse.redirect(new URL('/login', req.url));
    // }

    try {
        // const { payload } = await jwtVerify(
        //     token,
        //     new TextEncoder().encode(SECRET_KEY)
        // );

        // console.log('Decoded Token:', payload);

        // const now = Math.floor(Date.now() / 1000);
        // if (payload.exp < now) {
        //     console.log('Token expired. Redirecting to /login');
        //     return NextResponse.redirect(new URL('/login', req.url));
        // }
        
        return NextResponse.next();
    } catch (err) {
        console.error('Token validation error:', err);
        return NextResponse.redirect(new URL('/login', req.url));
    }
}

export const config = {
    matcher: [
        '/',
        '/dashboard',
        '/explore',
        '/matches',
        '/about',
        '/profile',
    ],
};
