import nodemailer from 'nodemailer';


interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export const sendEmail = async ({ to, subject, text, html }: EmailOptions): Promise<{ success: boolean; error?: string }> => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // Use other services like Yahoo, Outlook, etc., if applicable
      auth: {
        user: process.env.EMAIL_USER as string, // Your email address from environment variables
        pass: process.env.EMAIL_PASSWORD as string, // Your email password or app password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER as string, // Sender address
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully: ', info.response);

    return { success: true };
  } catch (error) {
    console.error('Error sending email: ', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};
