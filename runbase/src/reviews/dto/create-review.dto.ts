import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreateReviewDto {
  @IsNumber()
  @IsNotEmpty({ message: '유저 정보가 입력되지 않았습니다.' })
  readonly userId: number;

  @IsNumber()
  @IsNotEmpty({ message: '상품 정보가 입력되지 않았습니다.' })
  readonly productId: number;

  @IsString()
  @IsNotEmpty({ message: '작성된 리뷰가 없습니다.' })
  @Length(1, 1000)
  readonly comment: string;

  @IsInt()
  @Min(1, { message: '별점은 최소 1점 입니다.' })
  @Max(5, { message: '별점은 최대 5점 입니다.' })
  @IsNotEmpty({ message: '별점을 입력해주세요.' })
  readonly rating: number;
}
