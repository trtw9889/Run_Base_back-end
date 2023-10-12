import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class ReviewInputDto {
  @IsNumber()
  @IsNotEmpty({ message: '상품 정보가 입력되지 않았습니다.' })
  readonly productId: number;

  @IsString()
  @IsNotEmpty({ message: '작성된 리뷰가 없습니다.' })
  @Length(1, 1000)
  readonly comment: string;

  @IsInt()
  @Min(1, { message: 'Rating must be at least 1.' })
  @Max(5, { message: '별점은 최대 5점 입니다.' })
  @IsNotEmpty({ message: '별점을 입력해주세요.' })
  readonly rating: number;
}
