import { NextResponse } from 'next/server';

export async function middleware(req) {
  const token = req.cookies.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // validating the JWT
    try {
        const decoded = jwtDecode<JwtPayload>(token);
        const userId = decoded.user_id;
        const validationResponse = await fetch(`http://localhost:8000/account/${userId}/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    } catch (error) {
        console.error("Error sending payment received email:", error);
    }

  if (!validationResponse.ok) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: ['/donate_v2'],  // Protect only the /donate route
};