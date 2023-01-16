import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from 'nestjs-prisma';
import { ProductsModule } from './products/products.module';
import { ConfigModule } from '@nestjs/config';
import { CartModule } from './cart/cart.module';
import configuration from 'config/configuration';
import { ServeStaticModule } from '@nestjs/serve-static/dist/serve-static.module';

@Module({
  imports: [
    PrismaModule.forRoot(),
    ProductsModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [configuration]
    }),
    CartModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
