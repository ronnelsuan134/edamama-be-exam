import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateProductDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Title is Required' })
  title: string

  @ApiProperty()
  description?: string

  @ApiProperty()
  // @IsNotEmpty({ message: 'Image is Required' })
  photo: string

  @ApiProperty()
  @IsNotEmpty({ message: 'Price is Required' })
  price: number

  @ApiProperty()
  // @IsNotEmpty({ message: 'Stock is Required' })
  stock: number
}