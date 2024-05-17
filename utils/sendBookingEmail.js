const nodemailer = require('nodemailer');
const { createTransport } = require('nodemailer');

const sendBookingEmail = async (recipientEmail, subject, text) => {
    try {
        const transporter = createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // Set this to true if you're using a secure connection
            requireTLS: true,
            auth: {
                user: process.env.SMTP_MAIL,
                pass: process.env.SMTP_PASSWORD,
            },
            tls: {
                rejectUnauthorized: false // Add this line to ignore certificate validation
            }
        });

        await transporter.sendMail({
            from: process.env.SMTP_MAIL,
            to: recipientEmail,
            subject: subject,
            html: text,
        });
        console.log('Email sent successfully');
    } catch (error) {
        console.log(error, 'Email not sent');
    }
};

module.exports = sendBookingEmail;
