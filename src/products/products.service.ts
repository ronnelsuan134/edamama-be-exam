import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Product } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import * as fs from 'fs'

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService, private readonly configService: ConfigService) { }

  async get(skip: number, take: number): Promise<Product[]> {
    return await this.prisma.product.findMany({ skip: +skip, take: +take })
  }

  async create(file: any, body: CreateProductDto): Promise<Product> {
    return await this.prisma.product.create({
      data: {
        photo: `${this.configService.get<string>('baseURL')}/${file.path}`,
        title: body.title,
        price: Number(body.price),
        description: body.description,
        stock: Number(body.stock),
        dir: file.path
      },
    })
  }

  async update(file: any, body: UpdateProductDto, id: string): Promise<Product> {
    const data = await this.edit(id)
    if (data) {
      if (typeof file != "undefined") {
        fs.unlinkSync(data.dir)
      }
      return await this.prisma.product.update({
        where: { id }, data: {
          photo: (typeof file == "undefined") ? data.photo : `${this.configService.get<string>('baseURL')}/${file.path}`,
          title: body.title ? body.title : data.title,
          price: body.price ? Number(body.price) : data.price,
          description: body.description ? body.description : data.description,
          stock: body.stock ? Number(body.stock) : data.stock,
          dir: (typeof file == "undefined") ? data.dir : file.path
        }
      })
    }

    throw new BadRequestException({ statusCode: HttpStatus.BAD_REQUEST, message: 'No data found' })
  }

  async edit(id: string): Promise<Product> {
    return await this.prisma.product.findFirstOrThrow({ where: { id: id } })
  }

  async delete(id): Promise<Product> {
    try {
      const data = await this.prisma.product.delete({ where: { id: id } })
      fs.unlinkSync(data.dir)
      return data
    } catch (error) {
      throw new BadRequestException({ statusCode: HttpStatus.BAD_REQUEST, message: 'No data found' })
    }
  }


}
