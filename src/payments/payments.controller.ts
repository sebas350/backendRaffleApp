import { Controller, Post, Body} from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  async createPayment(@Body() paymentData: any) {
    // paymentData vendrá del Brick (token, amount, etc)
    return this.paymentsService.createPayment(paymentData);
  }

}