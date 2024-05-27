import bcrypt from 'bcryptjs';
import * as jose from 'jose';
import dbConnect from '../db/connect';

async function comparePassword(password, hash) {
    console.log("=====>>> Password: ", password);
    console.log("=====>>> Hash: ", hash);
    return (await bcrypt.compare(password, hash));
}


const generateToken = async (user) => {
    let expiration = process.env.JWT_EXPIRES_IN;
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const jwt = await new jose.SignJWT({ user })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime(expiration)
        .sign(secret);
    return (jwt);
};

const loginUser = async (email, password) => {
    const query = `SELECT * FROM users WHERE email = $1`;
    try{
        const client = await dbConnect.connect();
        const res = await client.query(query, [email]);
        if (res.rows.length === 0) {
            console.log("=====>>> User not found");
            return ({ is_success: false, error: "User not found" });
        }
        const user = res.rows[0];
        console.log("=====>>> User Hash: ", user.password);
        const match = await comparePassword(password, user.password);
        console.log("=====>>> Match: ", match);
        if (!match) {
            console.log("=====>>> Invalid email or password");
            return ({ is_success: false, error: "Invalid email or password" });
        }
        const token = await generateToken(user);
        client.release();
        return ({ is_success: true, token });
    } catch (err) {
        throw new Error(err.message);
    }
}

export { generateToken, loginUser };
