import { registerUser } from "../../../../../utils/auth/register";

export async function POST(req) {
    const query = await req.json();
    try {
        const email = query.email;
        const name = query.name;
        const password = query.password;
        if (!email || !name || !password) {
            return Response.json({ error: "Invalid Request" }, { status: 400 });
        }
        const res = await registerUser(name, email, password);
        if (res.is_success === true) {
            return Response.json({ message: "User registered successfully" });
        }
        return Response.json({ error: "Failed to register user" }, { status: 500 });
    } catch (err) {
        console.log(err);
        return Response.json({ error: "Error While handling the request" }, { status: 500 });
    }
}
