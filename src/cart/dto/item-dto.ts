import { ApiProperty } from "@nestjs/swagger";

export class ItemDto {

  @ApiProperty()
  productId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  price: number;
}