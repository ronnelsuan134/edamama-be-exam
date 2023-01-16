import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductConsumer } from './products.processor';
import { ProductsService } from './products.service';
import { MulterModule } from '@nestjs/platform-express';
import { PrismaService } from 'nestjs-prisma';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    MulterModule.register({}),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379
      }
    }),
    BullModule.registerQueue({
      name: 'ProductFile'
    }),
    ConfigModule
  ],
  controllers: [ProductsController],
  providers: [ProductsService, ProductConsumer, PrismaService]
})
export class ProductsModule { }
