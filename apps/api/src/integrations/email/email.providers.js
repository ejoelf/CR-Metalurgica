import nodemailer from 'nodemailer';

export function getEmailProvider() {
  const provider = process.env.EMAIL_PROVIDER || 'mock';

  if (provider === 'smtp') {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT || 587) === 465,
      auth: process.env.SMTP_USER
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          }
        : undefined,
    });
  }

  return null;
}
