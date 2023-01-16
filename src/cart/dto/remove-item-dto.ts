import { ApiProperty } from "@nestjs/swagger";

export class RemoveItemDto {
  @ApiProperty()
  productId: string;
}