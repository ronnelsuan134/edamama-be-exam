import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiParam, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { storage } from './multer.config';
import { ProductsService } from './products.service';

@Controller('products')
@ApiTags('products')
export class ProductsController {

  constructor(private readonly productService: ProductsService) { }

  @Get()
  async index(@Query('skip') skip: number, @Query('take') take: number, @Res() res: Response): Promise<Response> {
    const data = await this.productService.get(skip, take)
    return res.status(HttpStatus.OK).json({ data })
  }

  @Get('/:id')
  @ApiParam({ name: 'id' })
  async show(@Param('id') id: string, @Res() res: Response): Promise<Response> {
    try {
      const data = await this.productService.edit(id)
      return res.status(HttpStatus.OK).json({ data })
    } catch (err) {
      throw new HttpException('No data found!', HttpStatus.BAD_REQUEST)
    }
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        photo: {
          type: 'string',
          format: 'binary',
        },
        title: { type: 'string', required: ['true'] },
        description: { type: 'string', required: ['false'] },
        price: { type: 'number', required: ['true'] },
        dir: { type: 'string', required: ['false'] },
        stock: { type: 'number', required: ['true'] }
      }
    }
  })
  @UseInterceptors(
    FileInterceptor('photo', storage))
  async store(@UploadedFile() file, @Body() body: CreateProductDto, @Res() res: Response): Promise<Response> {
    const data = await this.productService.create(file, body)
    return res.status(HttpStatus.CREATED).json({ data })
  }

  @Put('/:id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        photo: {
          type: 'string',
          format: 'binary',
        },
        title: { type: 'string', required: ['false'] },
        description: { type: 'string', required: ['false'] },
        price: { type: 'number', required: ['false'] },
        dir: { type: 'string', required: ['false'] },
        stock: { type: 'number', required: ['false'] }
      }
    }
  })
  @UseInterceptors(FileInterceptor('photo', storage))
  @ApiParam({ name: 'id' })
  async update(@Param('id') id: string, @UploadedFile() file, @Body() body: UpdateProductDto, @Res() res: Response): Promise<Response> {
    const data = await this.productService.update(file, body, id)
    return res.status(HttpStatus.OK).json({ data })
  }


  @Delete('/:id')
  @ApiParam({ name: 'id' })
  async destroy(@Param('id') id: string, @Res() res: Response): Promise<Response> {
    const data = await this.productService.delete(id)
    return res.status(HttpStatus.OK).json({ data })
  }

}
