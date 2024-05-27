import { loginUser } from "../../../../../utils/auth/login";
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req) {
    try {
        const query = await req.json();
        const email = query.email;
        const password = query.password;

        if (!email || !password) {
            return NextResponse.json({ error: "Invalid Request" }, { status: 400 });
        }
        const res = await loginUser(email, password);
        if (res.is_success === true) {
            const token = res.token;
            cookies().set('session', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 7,
                path: '/'
            });
            return NextResponse.json({ message: "User logged in successfully", token: token });
        }
        return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    } catch (err) {
        return NextResponse.json({ error: "Error While handling the request" }, { status: 500 });
    }
}
