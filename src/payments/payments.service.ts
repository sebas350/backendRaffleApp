import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { ParticipantsService } from '../participants/participants.service';
import { Participant } from '../participants/entities/participant.entity';
import { MailService } from '../mail/mail.service';
import { CreateParticipantDto } from '../participants/dto/create-participant.dto';

@Injectable()
export class PaymentsService {
  private payment: Payment;

  constructor(
    private readonly configService: ConfigService,
    private readonly participantsService: ParticipantsService,
    private readonly mailService: MailService,
  ) {
    const client = new MercadoPagoConfig({
      accessToken: this.configService.get<string>('MERCADO_PAGO_ACCESS_TOKEN')!,
    });
    this.payment = new Payment(client);
  }


async processWebhook(paymentId: string) {
  try {
  
    const paymentCheck = await this.payment.get({ id: paymentId });

    const statusCheck = paymentCheck.status;

    switch (statusCheck) {
      case 'approved':
        //se envía un mail de confirmación junto con el comprobante de pago
        break;

      case 'in_process':
      case 'pending':
        //solo seguir esperando confirmación 
        break;

      case 'rejected':
      
      await this.participantsService.removeByPaymentId(paymentId);
      
      //envía mail al usuario notificando que el pago fue rechazado.
      
        break;

      default:
        console.log(`⚠️ Estado de pago desconocido: ${statusCheck}`);
    }

    return { success: true, statusCheck };
  } catch (err) {
    console.error('⚠️ Error procesando webhook:', err);
    return { success: false, error: err.message };
  }
}

  async createPayment(paymentData: any, participantData: CreateParticipantDto) {
    try {  
      const response = await this.payment.create({
      body: {
        ...paymentData,
        transaction_amount: 1000,
      },
    });
    

      // Evaluamos el estado del pago
      const status = response.status;

      if (status === 'approved') {
        const participant = await this.participantsService.create(participantData);
        
        await this.mailService.sendPaymentConfirmation(
  participantData.mail,
  'Comprobante de pago - Rifa',
  `
    <h2>Comprobante de pago</h2>
    <p><b>Participante:</b> ${participantData.fullname}</p>
    <p><b>Número de participante:</b> ${participantData.number}</p>
    <p><b>Monto pagado:</b> $${paymentData.transaction_amount} ${response.currency_id}</p>
    <p><b>Método de pago:</b> ${paymentData.payment_method_id.toUpperCase()} terminada en ${response.card?.last_four_digits}</p>
    <p><b>ID de operación (MP):</b> ${response.id}</p>
    <p><b>Estado:</b> ${response.status}</p>
    <hr />
    <p>¡Gracias por participar! 🎉</p>
  `,
);
        
        
        return {
          message: 'Gracias por paricipar',
          
          validation: true,
        };
      }

      if (status === 'in_process' || status === 'pending') {
      
      participantData.payment_id = response.id?.toString() ?? '';
        const participant = await this.participantsService.create(participantData);
        return {
          validation: true,
          message:
            'El pago está en proceso. Se registró el participante, recibirá un email cuando el pago se confirme.',
            response,
        };
      }

      if (status === 'rejected') {
        return {
          validation: false,
          message: `El pago fue rechazado, por favor reintente. El participante no fue registrado. ${JSON.stringify(response.status_detail, null, 2)}`,
        };
      }

    } catch (error) {
      console.error('Error creating payment:', error);
    }
  }
}
