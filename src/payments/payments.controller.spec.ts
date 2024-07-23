import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { CreateCardTokenDto } from './dto/create-cardToken.dto';
import { cardTransactionDto } from './dto/create-cardTransaction.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('PaymentsController', () => {
  let controller: PaymentsController;
  let service: PaymentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [
        {
          provide: PaymentsService,
          useValue: {
            getToken: jest.fn().mockResolvedValue('randomToken12345'),
            createCardToken: jest.fn().mockResolvedValue('cardToken123'),
            createTransactionCard: jest
              .fn()
              .mockResolvedValue('transactionId12345'),
          },
        },
      ],
    }).compile();

    controller = module.get<PaymentsController>(PaymentsController);
    service = module.get<PaymentsService>(PaymentsService);
  });

  describe('Genera token por llave publica', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    it('should get token and return a string', async () => {
      const result = await controller.getToken();
      expect(result).toBe('randomToken12345');
      expect(typeof result).toBe('string');
    });
  });

  describe('Crea token de una tarjeta', () => {
    it('should return an error if createCardToken fails', async () => {
      const createCardTokenDto: CreateCardTokenDto = {
        number: '4111111111111111',
        cvc: '123',
        exp_month: '08',
        exp_year: '28',
        card_holder: 'José Pérez',
      };
      const errorMessage = 'Error al crear el token de la tarjeta'; // Mensaje real del controlador
      jest
        .spyOn(service, 'createCardToken')
        .mockRejectedValue(
          new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR),
        );

      await expect(
        controller.addCard(createCardTokenDto),
      ).rejects.toMatchObject({
        response: errorMessage,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    });
  });

  describe('Transacción Automática', () => {
    it('should return an error if createTransactionCard fails', async () => {
      const cardTransactionDto: cardTransactionDto = {
        transaction: {
          amount_in_cents: 320000,
          currency: 'COP',
          customer_email: 'cliente@correo.com',
          payment_method: {
            type: 'CARD',
            installments: 1,
            token: 'invalidToken',
          },
          reference: '2024-07-23T15:33:35.047Z',
          acceptance_token: 'invalidAcceptanceToken',
          signature: 'invalidSignature',
        },
        card: {
          number: '4111111111111111',
          cvc: '123',
          exp_month: '08',
          exp_year: '28',
          card_holder: 'José Pérez',
        },
      };

      const errorMessage = 'Error al crear la transacción automática'; // Mensaje real del controlador
      jest
        .spyOn(service, 'createTransactionCard')
        .mockRejectedValue(
          new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR),
        );

      await expect(
        controller.transactionCard(cardTransactionDto),
      ).rejects.toMatchObject({
        response: errorMessage,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    });
  });
});
