import { IsNumber } from 'class-validator';

export class AddCartsDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  sizeId: number;
}
