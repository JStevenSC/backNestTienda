export class CreateTransactionDto {
  amount_in_cents: number;
  currency: string;
  customer_email: string;
  payment_method: {
    type: string;
    token?: string;
    installments: number;
  };
  reference: string;
  acceptance_token: string;
  signature: string;
}
