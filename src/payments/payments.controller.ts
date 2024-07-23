import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreateCardTokenDto } from './dto/create-cardToken.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { cardTransactionDto } from './dto/create-cardTransaction.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly pagosService: PaymentsService) {}

  // Endpoint para obtener el token de aceptación
  @Get('token')
  async getToken(): Promise<string> {
    try {
      return await this.pagosService.getToken();
    } catch (error) {
      throw new HttpException(
        'Error al obtener el token de aceptación',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Endpoint para crear un token de tarjeta
  @Post('tokencard')
  async addCard(@Body() newCard: CreateCardTokenDto): Promise<string> {
    try {
      console.log(newCard);
      return await this.pagosService.createCardToken(newCard);
    } catch (error) {
      throw new HttpException(
        'Error al crear el token de la tarjeta',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Endpoint para crear una transacción manual
  @Post('transaction')
  async transaction(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<string> {
    try {
      console.log(createTransactionDto);
      return await this.pagosService.createTransaction(createTransactionDto);
    } catch (error) {
      throw new HttpException(
        'Error al crear la transacción manual',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Endpoint para crear una transacción automática
  @Post('transactioncard')
  async transactionCard(
    @Body() cardTransactionDto: cardTransactionDto,
  ): Promise<string> {
    try {
      console.log(cardTransactionDto);
      return await this.pagosService.createTransactionCard(cardTransactionDto);
    } catch (error) {
      throw new HttpException(
        'Error al crear la transacción automática',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Endpoint para verificar el estado de una transacción por ID
  @Get('token/:id')
  async getIdTransaction(@Param('id') id: string): Promise<string> {
    try {
      return await this.pagosService.getIdTransaction(id);
    } catch (error) {
      throw new HttpException(
        'Error al obtener el estado de la transacción',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
