import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'SMTP',
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

const sendOTP = async (email, name, otp) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'OTP for Verify your account',
            text: `Hi ${name},\n\nYour OTP for email verification is <b>${otp}</b>`
        };
        await transporter.sendMail(mailOptions);
        return (true);
    } catch (err) {
        return (false);
    }
}

export { sendOTP };