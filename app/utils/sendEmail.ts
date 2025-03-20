import nodemailer from 'nodemailer';


interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export const sendEmail = async ({ to, subject, text, html }: EmailOptions): Promise<{ success: boolean; error?: string }> => {
  try {
    // Verificar que las variables de entorno estén configuradas
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.error('Email credentials are not properly configured in environment variables');
      return { 
        success: false, 
        error: 'Email service is not properly configured' 
      };
    }

    // Verificación del formato de la contraseña (con espacios en blanco)
    const password = process.env.EMAIL_PASSWORD;
    console.log(`📧 Configurando email con: ${process.env.EMAIL_USER}`);
    console.log(`📧 Longitud de la contraseña: ${password.length} caracteres`);
    console.log(`📧 La contraseña contiene espacios: ${password.includes(' ')}`);
    
    // Para Gmail con contraseñas de aplicación, los espacios están bien
    // Son contraseñas de 16 caracteres formadas por 4 grupos de 4 letras con espacios entre ellos
    
    // Crear el transportador con las credenciales de Gmail
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: password, // Los espacios son válidos en contraseñas de aplicación de Gmail
      },
      // Opciones adicionales para mejorar la entrega
      tls: {
        rejectUnauthorized: false // Ayuda con algunos problemas de certificados
      },
      debug: true, // Habilitar debugging
      logger: true  // Habilitar logging
    });

    // Verificar la conexión antes de enviar
    console.log('📧 Verificando conexión SMTP...');
    try {
      await transporter.verify();
      console.log('📧 SMTP connection verified successfully');
    } catch (verifyError) {
      console.error('📧 SMTP verification failed:', verifyError);
      return { 
        success: false, 
        error: `SMTP verification failed: ${verifyError instanceof Error ? verifyError.message : 'Unknown error'}` 
      };
    }

    // Configuración del email
    const mailOptions = {
      from: `"Reservation System" <${process.env.EMAIL_USER}>`, // Nombre remitente más amigable
      to,
      subject,
      text,
      html,
      // Headers adicionales para reducir la probabilidad de ser marcado como spam
      headers: {
        'Priority': 'high',
        'X-Mailer': 'Restaurant Booking System'
      }
    };

    console.log(`📧 Enviando email a: ${to}`);
    
    // Intentar enviar el email
    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Email enviado correctamente');
    console.log('📧 Message ID:', info.messageId);
    if (info.envelope) {
      console.log('📧 Envelope:', info.envelope);
    }

    return { success: true };
  } catch (error) {
    console.error('📧 Error sending email: ', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown email error' 
    };
  }
};
