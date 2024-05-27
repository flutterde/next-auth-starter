import { verifyEmail } from "../../../../../utils/auth/verify-email";
import { generateToken } from "../../../../../utils/auth/login";
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request) {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');
    const body = await request.json();

    try {
        const otpCode = body.otp_code;
        const res = await verifyEmail(email, otpCode);

        if (res.is_success) {
            const token = await generateToken(res.user);
            cookies().set('session', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 7,
                path: '/'
            });
            return NextResponse.json({ message: "Email verified successfully", token: token });
        }
        return NextResponse.json({ error: res.message }, { status: 400 });
    } catch (err) {
        console.log("======= >>. Err   ", err);
        return NextResponse.json({ error: "Error While handling the request" }, { status: 500 });
    }
}
