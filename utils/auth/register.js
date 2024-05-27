import bcrypt from 'bcryptjs';
import dbConnect from '../db/connect';
import { sendOTP } from './send-otp';

async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10); // Adjust cost factor as needed
    const hash = await bcrypt.hash(password, salt);
    return (hash);
}


async function saveUserToDatabase(name, email, password, otp) {
    // Save user to database
    const encryptedPassword = await hashPassword(password);
    const query = `INSERT INTO users (name, email, password, otp_code) VALUES ($1, $2, $3, $4)`;
    try{
        const client = await dbConnect.connect();
        await client.query(query, [name, email, encryptedPassword, otp]);
        await sendOTP(email, name, otp);
        client.release();
        return ({is_success: true});
    } catch (err) {
        return ({is_success: false});
    }
}


const registerUser = async (name, email, password) => {
    const otpCode = Math.floor(10000 + Math.random() * 90000); // 5 digits
    try {
        const saved = await saveUserToDatabase(name, email, password, otpCode);
        if (saved.is_success === true) {
            return ({ is_success: true, success: "User registered successfully." });
        }
        return ({ is_success: false, error: "Failed to register user." });
    } catch (err) {
        throw new Error(err.message);
    }
}

export { registerUser };