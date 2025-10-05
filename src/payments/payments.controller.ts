import { Controller, Post, Body } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { Participant } from '../participants/entities/participant.entity';
import { CreateParticipantDto } from '../participants/dto/create-participant.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('webhooks')
  async handleWebhook(@Body() body: any) {

    if (body.type === 'payment' && body.data?.id) {
      const paymentId = body.data.id;
      
this.paymentsService.processWebhook(paymentId);
    }

    return { received: true };
}  
  
  @Post()
  async processPayment(@Body() body: { paymentData: any; participantData: CreateParticipantDto }) {
    try {
      const { paymentData, participantData } = body;

      const result = await this.paymentsService.createPayment(
        paymentData,
        participantData,
      );

      return result;
    } catch (error) {
      return { status: 'error', message: 'Payment failed' };
    }
  }
}
