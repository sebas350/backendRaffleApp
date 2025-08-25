export interface MercadoPagoPayment {
  id: number;
  status: 'approved' | 'pending' | 'rejected' | string;
  status_detail: string;
  transaction_amount: number;
  currency_id: string;
  date_created: string;
  date_approved: string | null;
  date_last_updated: string;
  payment_method_id: string;
  payment_type_id: string;
  description: string;
  installments: number;
  payer: {
    email: string;
    id?: string;
    type?: string;
  };
  transaction_details?: {
    net_received_amount: number;
    total_paid_amount: number;
    overpaid_amount: number;
    installment_amount: number;
  };
  [key: string]: any; // por si Mercado Pago cambia/agrega campos
}