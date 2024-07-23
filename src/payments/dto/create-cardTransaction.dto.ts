import { CreateCardTokenDto } from './create-cardToken.dto';
import { CreateTransactionDto } from './create-transaction.dto';

export class cardTransactionDto {
  transaction: CreateTransactionDto;
  card: CreateCardTokenDto;
}
