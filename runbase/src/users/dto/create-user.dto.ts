import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';
import { SignInUserDto } from './signIn-user.dto';

export class CreateUserDto extends PartialType(SignInUserDto) {
  @IsString()
  @IsNotEmpty({ message: '이름은 필수 입력 항목입니다.' })
  readonly name: string;

  @IsNumberString()
  @IsNotEmpty({ message: '휴대폰 전화번호는 필수 입력 항목입니다.' })
  readonly phoneNumber: string;
}
