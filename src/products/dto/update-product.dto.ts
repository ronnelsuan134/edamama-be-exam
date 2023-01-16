import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";


export class UpdateProductDto {
  @ApiProperty()
  title?: string

  @ApiProperty()
  description?: string

  @ApiProperty()
  // @IsNotEmpty({ message: 'Image is Required' })
  photo?: string

  @ApiProperty()
  price?: number

  @ApiProperty()
  // @IsNotEmpty({ message: 'Stock is Required' })
  stock?: number
}
