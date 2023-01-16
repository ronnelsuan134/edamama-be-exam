import { Body, Controller, Delete, Get, HttpStatus, NotFoundException, Post, Request, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { ItemDto } from './dto/item-dto';
import { Response } from 'express';
import { RemoveItemDto } from './dto/remove-item-dto';
import { ConfigService } from '@nestjs/config';

@Controller('cart')
@ApiTags('carts')
export class CartController {
  constructor(private readonly cartService: CartService, private readonly configService: ConfigService) { }


  @Get()
  async index(@Res() res: Response): Promise<Response> {
    const userId = this.configService.get<string>('userId')

    const data = await this.cartService.getCart(userId)
    return res.status(HttpStatus.OK).json({ data })
  }

  @Post('/')
  async addItem(@Body() item: ItemDto, @Res() res: Response): Promise<any> {
    const userId = this.configService.get<string>('userId')
    const data = await this.cartService.addItemToCart(userId, item)
    return res.status(HttpStatus.OK).json({ data })
  }

  @Delete('/')
  async removeItemFromCart(@Body() body: RemoveItemDto) {
    const userId = this.configService.get<string>('userId')
    const cart = await this.cartService.removeItemFromCart(userId, body.productId);
    if (!cart) throw new NotFoundException('Item does not exist');
    return cart;
  }

}
