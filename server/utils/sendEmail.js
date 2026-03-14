const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Create a transporter
    // For production, use real credentials. For local/dev, we log to console if no env vars.
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
        port: process.env.SMTP_PORT || 2525,
        auth: {
            user: process.env.SMTP_USER || '',
            pass: process.env.SMTP_PASS || ''
        }
    });

    const message = {
        from: `${process.env.FROM_NAME || 'PreciseCCTV'} <${process.env.FROM_EMAIL || 'no-reply@precisecctv.com'}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html
    };

    // If no SMTP credentials, log to console and simulate success
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.log('----------------------------------------------------');
        console.log(`[EMAIL MOCK] To: ${options.email}`);
        console.log(`[EMAIL MOCK] Subject: ${options.subject}`);
        console.log(`[EMAIL MOCK] Message: ${options.message}`);
        console.log('----------------------------------------------------');
        return { success: true, mock: true };
    }

    const info = await transporter.sendMail(message);
    console.log('Message sent: %s', info.messageId);
    return info;
};

module.exports = sendEmail;
