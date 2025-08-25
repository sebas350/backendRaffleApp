import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { MercadoPagoPayment } from './types';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  private readonly accessToken: string;

  constructor(private readonly configService: ConfigService) {
    this.accessToken = this.configService.get<string>('MERCADO_PAGO_ACCESS_TOKEN')!;
  }

  async createPayment(paymentData: any) {
  try {
    const res = await axios.post(
      'https://api.mercadopago.com/v1/payments',
      {
        token: paymentData.token,
        issuer_id: paymentData.issuer_id,
        payment_method_id: paymentData.payment_method_id,
        transaction_amount: paymentData.transaction_amount,
        installments: paymentData.installments,
        payer: {
          email: paymentData.payer.email,
          identification: {
            type: paymentData.payer.identification.type,
            number: paymentData.payer.identification.number,
          },
        },
      },
      { headers: { Authorization: `Bearer ${this.accessToken}` } },
    );

    return res.data;
  } catch (err: any) {
    console.error('❌ Error MercadoPago:', err.response?.data || err.message);
    throw err;
  }
}
}