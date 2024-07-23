import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import axios, { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import { CreateCardTokenDto } from './dto/create-cardToken.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { cardTransactionDto } from './dto/create-cardTransaction.dto';
import * as crypto from 'crypto';

@Injectable()
export class PaymentsService {
  private readonly wompiUrl = 'https://api-sandbox.co.uat.wompi.dev/v1';
  private readonly publicKey = 'pub_stagtest_g2u0HQd3ZMh05hsSgTS2lUV8t3s4mOt7';
  private readonly stagtestIntegrity =
    'stagtest_integrity_nAIBuqayW70XpUqJS4qf4STYiISd89Fp';

  constructor(private readonly httpService: HttpService) {}

  async getToken(): Promise<string> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.wompiUrl}/merchants/${this.publicKey}`),
      );
      return response.data.data.presigned_acceptance.acceptance_token;
    } catch (error) {
      console.error(
        'Error al obtener el token de aceptación:',
        error.response?.data || error.message,
      );
      throw new HttpException(
        'Error al obtener el token de aceptación',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getIdTransaction(id: string): Promise<any> {
    try {
      const response: AxiosResponse<any> = await firstValueFrom(
        this.httpService.get(`${this.wompiUrl}/transactions/${id}`),
      );
      return response.data.data.status;
    } catch (error) {
      console.error(
        'Error al obtener el estado de la transacción:',
        error.response?.data || error.message,
      );
      throw new HttpException(
        'Error al obtener el estado de la transacción',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createCardToken(createCardToken: CreateCardTokenDto): Promise<any> {
    try {
      const response = await axios.post(
        `${this.wompiUrl}/tokens/cards`,
        createCardToken,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.publicKey}`,
          },
        },
      );
      return response.data.data.id;
    } catch (error) {
      console.error(
        'Error al crear el token de tarjeta:',
        error.response?.data || error.message,
      );
      throw new HttpException(
        'Error al crear el token de la tarjeta',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createTransaction(transactionDto: CreateTransactionDto): Promise<any> {
    try {
      const response = await axios.post(
        `${this.wompiUrl}/transactions/`,
        transactionDto,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.publicKey}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error(
        'Error al crear la transacción:',
        error.response?.data || error.message,
      );
      throw new HttpException(
        'Error al crear la transacción',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createTransactionCard(
    cardTransactionDto: cardTransactionDto,
  ): Promise<any> {
    try {
      const token = await this.getToken();
      cardTransactionDto.transaction.acceptance_token = token;

      const createCardTokenDto: CreateCardTokenDto = cardTransactionDto.card;
      const tokenCard = await this.createCardToken(createCardTokenDto);

      cardTransactionDto.transaction.payment_method.token = tokenCard;

      const fechaHoraActual = new Date().toISOString();
      const referencia = `${fechaHoraActual}${cardTransactionDto.transaction.amount_in_cents}${cardTransactionDto.transaction.currency}${this.stagtestIntegrity}`;
      const hash = crypto.createHash('sha256').update(referencia).digest('hex');

      cardTransactionDto.transaction.reference = fechaHoraActual;
      cardTransactionDto.transaction.signature = hash;

      return this.createTransaction(cardTransactionDto.transaction);
    } catch (error) {
      console.error(
        'Error al crear la transacción automática:',
        error.response?.data || error.message,
      );
      throw new HttpException(
        'Error al crear la transacción automática',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
