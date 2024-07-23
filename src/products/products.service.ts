import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './products.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async createProduct(product: CreateProductDto): Promise<Product> {
    const newProduct = this.productRepository.create(product);
    return this.productRepository.save(newProduct);
  }

  async getProducts(): Promise<Product[]> {
    return this.productRepository.find();
  }

  async getProduct(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    return product;
  }

  async deleteProduct(id: number): Promise<any> {
    const result = await this.productRepository.delete({ id });
    if (result.affected === 0) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    return { message: 'Product delete successfully' };
  }

  async updateProduct(id: number, product: UpdateProductDto): Promise<any> {
    const productFound = await this.productRepository.findOne({
      where: { id },
    });
    if (!productFound) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    const updatedAmount = productFound.amount - product.amount;
    if (updatedAmount < 0) {
      throw new HttpException('Insufficient quantity', HttpStatus.BAD_REQUEST);
    }

    product.amount = updatedAmount;
    await this.productRepository.update(id, product);
    return { message: 'Product updated successfully' };
  }

  async updateProductAdd(id: number, product: UpdateProductDto): Promise<any> {
    const productFound = await this.productRepository.findOne({
      where: { id },
    });
    if (!productFound) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    // Actualiza todos los campos del producto encontrado con los valores del DTO
    const updatedProduct = { ...productFound, ...product };

    // Guarda los cambios en la base de datos
    await this.productRepository.save(updatedProduct);
    return { message: 'Product quantity updated successfully' };
  }
}
