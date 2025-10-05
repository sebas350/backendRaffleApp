import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class MailService {
  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('SENDGRID_API_KEY');
    
    if (!apiKey) {
      throw new Error('❌ SENDGRID_API_KEY is not defined in environment variables');
    }
    sgMail.setApiKey(apiKey);
  }

  async sendPaymentConfirmation(to: string, subject: string, htmlContent: string) {
    const msg = {
      to,
      from: 'tellosebastian.developer@gmail.com', // 👈 tu remitente verificado en SendGrid
      subject,
      html: htmlContent,
    };

    try {
      await sgMail.send(msg);
      return { success: true, message: 'Email sent successfully' };
    } catch (error) {
      console.error('⚠️ Error sending email:', error.response?.body || error);
      return { success: false, message: 'Error sending email', error };
    }
  }
}