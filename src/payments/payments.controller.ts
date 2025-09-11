import { Controller, Post, Body } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { Participant } from '../participants/entities/participant.entity';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  async processPayment(@Body() body: any) {
    try {
      const { paymentData, participantData } = body;

      const result = await this.paymentsService.createPayment(
        paymentData,
        participantData as Partial<Participant>,
      );

      return result;
    } catch (error) {
      return { status: 'error', message: 'Payment failed' };
    }
  }
}
