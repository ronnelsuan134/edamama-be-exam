import { Injectable } from '@nestjs/common';
import { Cart, Item, PrismaClient } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { ItemDto } from './dto/item-dto';

@Injectable()
export class CartService {

  constructor(private readonly prisma: PrismaService) { }

  async createCart(userId: string, item: ItemDto, subTotalPrice: number, totalPrice: number): Promise<Cart> {
    return await this.prisma.cart.create({
      data: {
        userId,
        items: {
          create: [
            { ...item, subTotalPrice }
          ]
        },
        totalPrice
      }
    })
  }

  async getCart(userId: string): Promise<Cart> {
    const data = await this.prisma.cart.findFirst({ where: { userId }, include: { items: true } })
    return data
  }

  async addItemToCart(userId: string, item: ItemDto): Promise<String> {
    const { productId, quantity, price } = item
    const subTotalPrice = quantity * price

    let cart = await this.prisma.cart.findFirst({ where: { userId }, include: { items: true } })
    if (cart) {
      const itemPromise = cart.items.map((data) => {
        if (data.productId == productId) {
          return this.prisma.item.update({
            where: { id: data.id },
            data: {
              quantity: Number(data.quantity) + Number(quantity),
              subTotalPrice: data.price * (Number(data.quantity) + Number(quantity))
            }
          })
        }
      })
      const updatedItems = await Promise.all(itemPromise);
      if (updatedItems[0] == undefined) {
        const data = await this.prisma.item.create({
          data: {
            cartId: cart.id,
            ...item,
            subTotalPrice,
          }
        })
      }

      const newItems = await this.prisma.cart.findFirst({ where: { userId }, include: { items: true } })
      await this.recalculateCart(cart.id, newItems.items)
      return 'Success';
    }

    await this.createCart(userId, item, subTotalPrice, price);
    return 'Success';
  }

  async recalculateCart(cartId: string, items: any[]) {
    let totalPrice = 0;
    items.forEach(item => {
      totalPrice += (item.quantity * item.price);
    })
    return await this.prisma.cart.update({ where: { id: cartId }, data: { totalPrice } })
  }

  async removeItemFromCart(userId: string, productId: string): Promise<any> {
    const cart = await this.prisma.cart.findFirst({ where: { userId }, include: { items: true } })
    let arr = []
    cart.items.map(async (item, index) => {
      if (item.productId == productId) {
        await this.prisma.item.delete({ where: { id: item.id } })
        cart.items.splice(index, 1)
      }
      arr.push(item)
    });
    await this.recalculateCart(cart.id, arr)
    return 'success';
  }


}
