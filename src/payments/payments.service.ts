import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { ParticipantsService } from '../participants/participants.service';
import { Participant } from '../participants/entities/participant.entity';

@Injectable()
export class PaymentsService {
  private payment: Payment;

  constructor(
    private readonly configService: ConfigService,
    private readonly participantsService: ParticipantsService,
  ) {
    const client = new MercadoPagoConfig({
      accessToken: this.configService.get<string>('MERCADO_PAGO_ACCESS_TOKEN')!,
    });
    this.payment = new Payment(client);
  }

  async createPayment(paymentData: any, participantData: Partial<Participant>) {
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
        return {
          message: 'Gracias por paricipar',
          
          validation: true,
        };
      }

      if (status === 'in_process' || status === 'pending') {
        const participant = await this.participantsService.create(participantData);
        return {
          validation: true,
          message:
            'El pago está en proceso. Se registró el participante, recibirá un email cuando el pago se confirme.',
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
