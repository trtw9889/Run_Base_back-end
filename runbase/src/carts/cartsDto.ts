import { IsNumber } from 'class-validator';

export class AddCartsDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  sizeId: number;
}

export class GetCartsDto {
  userId: number;
  productSizeId: number;
  quantity: number;
  productId: number;
  productName: string;
  productPrice: number;
  productColor: string;
  imageUrl: string;
}
