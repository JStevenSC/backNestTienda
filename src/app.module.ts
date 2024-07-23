import { Module } from '@nestjs/common';
//import { AppController } from './app.controller';
//import { AppService } from './app.service';
//import { ProductsController } from './products/products.controller';
import { ProductsModule } from './products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsService } from './payments/payments.service';
import { PaymentsController } from './payments/payments.controller';
import { HttpModule } from '@nestjs/axios';
import { HashService } from './hash/hash.service';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'steven123',
      database: 'products',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    ProductsModule,
  ],
  providers: [PaymentsService, HashService],
  controllers: [PaymentsController],
  //controllers: [AppController, ProductsController],
  //providers: [AppService],
})
export class AppModule {}
