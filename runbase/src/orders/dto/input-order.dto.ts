import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class OrderInputDto {
  @IsString()
  @IsNotEmpty({ message: '총 결제 금액을 확인해주세요.' })
  readonly totalPrice: string;

  @IsOptional()
  @IsNumber()
  readonly shipmentId: number;
}
