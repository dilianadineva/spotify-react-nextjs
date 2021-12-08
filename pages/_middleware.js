import { getToken } from "next-auth/jwt";
import { NextResponse } from 'next/server'

export async function middleware (req){
    // console.log("middleware")        
    //Token will exist if user is logged in
    const token = await getToken({req, secret: process.env.JWT_SECRET})
    // console.log("req.nextUrl: ", req.nextUrl)
    const {pathname} = req.nextUrl
    //Allow the request if:
    //1) Token exists
    //2) or it's a request for next auth session (trying to log in ie) & provider fetching
    if(pathname.includes('/api/auth') || token){
        return NextResponse.next()
    }
    if(!token && pathname !== '/login'){
        return NextResponse.redirect('/login')
    }
}