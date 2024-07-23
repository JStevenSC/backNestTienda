import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  ParseIntPipe,
  Delete,
  Patch,
  HttpException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './products.service';
import { Product } from './products.entity';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Get() // obtiene productos
  async getProducts(): Promise<Product[]> {
    return this.productService.getProducts();
  }

  @Get(':id') // obtiene producto por id
  async getProduct(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.productService.getProduct(id);
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }

  @Post() // crea nuevo producto
  async createProduct(@Body() newProduct: CreateProductDto): Promise<Product> {
    console.log(newProduct);
    return this.productService.createProduct(newProduct);
  }

  @Delete(':id') // elimina producto por id
  async deleteProduct(@Param('id', ParseIntPipe) id: number): Promise<void> {
    try {
      await this.productService.deleteProduct(id);
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }

  @Patch(':id') // actualiza producto por id
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() product: UpdateProductDto,
  ): Promise<any> {
    try {
      return await this.productService.updateProduct(id, product);
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }

  @Patch('add/:id') // agrega cantidad al producto por id
  async updateProductAdd(
    @Param('id', ParseIntPipe) id: number,
    @Body() product: UpdateProductDto,
  ): Promise<any> {
    try {
      return await this.productService.updateProductAdd(id, product);
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }
}
