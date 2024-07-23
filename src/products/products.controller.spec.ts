import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockProductsService = {
    getProducts: jest.fn(() => Promise.resolve([])),
    getProduct: jest.fn((id: number) =>
      Promise.resolve({ id, name: 'Test Product' }),
    ),
    createProduct: jest.fn((product: CreateProductDto) =>
      Promise.resolve({ id: 1, ...product }),
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Obtiene los productos', () => {
    it('debería devolver un array de productos', async () => {
      expect(await controller.getProducts()).toEqual([]);
    });
  });

  describe('Obtiene un producto por id', () => {
    it('debería devolver un producto por id', async () => {
      expect(await controller.getProduct(1)).toEqual({
        id: 1,
        name: 'Test Product',
      });
    });

    it('debería lanzar un error si el producto no se encuentra', async () => {
      jest
        .spyOn(service, 'getProduct')
        .mockRejectedValueOnce({ response: 'Not Found', status: 404 });
      try {
        await controller.getProduct(999);
      } catch (e) {
        expect(e.response).toBe('Not Found');
        expect(e.status).toBe(404);
      }
    });
  });

  describe('Crea un producto', () => {
    it('debería crear un nuevo producto', async () => {
      const newProduct: CreateProductDto = {
        product: 'New Product',
        price: 100,
      };
      expect(await controller.createProduct(newProduct)).toEqual({
        id: 1,
        ...newProduct,
      });
    });
  });
});
