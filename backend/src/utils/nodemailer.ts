import nodemailer from 'nodemailer';

function generateOTP():string {
    const numbers = '1234567890';
    let otp = '';
    for(let i=0; i< 6; i++) {
        otp += numbers[Math.floor(Math.random() * numbers.length)]
    }
    return otp;
}

interface SendOtpResponse {
    status: boolean;
    otp?: string;
    message?: string;
}

interface SendEmailResponse {
    status: boolean;
    message?: string;
}

const SendOtp = async(email:string): Promise<SendOtpResponse> => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const otp = generateOTP();

        const info = await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: 'Your OTP',
            text: `You OTP is: ${otp}`,
            html: `<p>Your OTP is: <b>${otp}</b></p>`,
        })

        if(info.accepted.length > 0) {
            return {status: true, otp};
        } else {
            return { status:false, message: 'Failed to send OTP'}
        }

    } catch(error) {
        console.error('Error sending otp:', error);
        return {status:false, message: 'internal server error'};
    }
}


const sendVerificationEmail = async (email: string, therapistName: string, isVerified: boolean) : Promise<SendEmailResponse> => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            },
            tls: {
                rejectUnauthorized: false
            }
        });
        const subject = isVerified ? 'Verification Successful' : 'Verification Revoked';
        const message = isVerified
            ? `Dear ${therapistName}, your account has been successfully verified.`
            : `Dear ${therapistName}, your account verification has been failed. Please provide more information.`;

            const info = await transporter.sendMail({
                from: process.env.EMAIL,
                to: email,
                subject: subject,
                text: message,
                html: `<p>${message}</p>`
            });

            if(info.accepted.length > 0) {
                return { status: true};
            } else {
                return { status: false, message: 'Failed to send email'}
            }
    } catch (error) {
        console.error(`Error sendinf email:`, error);
        return { status: false, message: 'internal Server Error'}
    }
}

export {SendOtp, sendVerificationEmail};