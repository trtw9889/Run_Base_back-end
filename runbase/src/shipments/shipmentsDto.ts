import {
  IsBoolean,
  IsNotEmpty,
  IsNumberString,
  IsString,
} from 'class-validator';

export class AddShipmentsDto {
  @IsString()
  @IsNotEmpty({ message: '배송지 명을 적어주세요.' })
  nickname: string;

  @IsString()
  @IsNotEmpty({ message: '수령인을 적어주세요.' })
  receiver: string;

  @IsNumberString()
  @IsNotEmpty({ message: '휴대폰 전화번호는 필수 입력 항목입니다.' })
  readonly phoneNumber: string;

  @IsString()
  @IsNotEmpty({ message: '우편번호를 적어주세요.' })
  zipcode: string;

  @IsString()
  @IsNotEmpty({ message: '도로명 주소를 적어주세요.' })
  streetAddress: string;

  @IsString()
  @IsNotEmpty({ message: '상세 주소를 적어주세요.' })
  detailAddress: string;

  @IsBoolean()
  @IsNotEmpty({ message: 'isMainAddress 값을 넣어주세요.' })
  isMainAddress: boolean;

  @IsBoolean()
  @IsNotEmpty({ message: 'storage 값을 넣어주세요.' })
  storage: boolean;
}

export class UpdateShipmentsDto {
  @IsString()
  @IsNotEmpty({ message: '배송지 명을 적어주세요.' })
  nickname: string;

  @IsString()
  @IsNotEmpty({ message: '수령인을 적어주세요.' })
  receiver: string;

  @IsNumberString()
  @IsNotEmpty({ message: '휴대폰 전화번호는 필수 입력 항목입니다.' })
  readonly phoneNumber: string;

  @IsString()
  @IsNotEmpty({ message: '우편번호를 적어주세요.' })
  zipcode: string;

  @IsString()
  @IsNotEmpty({ message: '도로명 주소를 적어주세요.' })
  streetAddress: string;

  @IsString()
  @IsNotEmpty({ message: '상세 주소를 적어주세요.' })
  detailAddress: string;
}
