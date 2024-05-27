import dbConnect from "../db/connect";

const verifyEmail = async (email, otp) => {
    const query = `SELECT * FROM public.verify_email($1, $2)`;
    try {
        const client = await dbConnect.connect();
        const res = await client.query(query, [email, otp]);
        client.release();
        if (res.rows.length > 0) {
            const user = res.rows[0];
            return ({is_success: true, user: user});
        }
        return ({is_success: false, message: "Invalid OTP code"});
    } catch (err) {
        dbConnect.end();
        throw new Error(err.message);
    }
}

export { verifyEmail };