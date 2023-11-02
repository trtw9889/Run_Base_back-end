import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class PasswordDto {
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
    message: '비밀번호는 영어 소문자, 숫자, 특수문자를 모두 포함해야 합니다.',
  })
  @IsNotEmpty({ message: '비밀번호는 필수 입력 항목입니다.' })
  readonly password: string;
}

export class InfoDto {
  @IsString()
  @IsNotEmpty({ message: '이름은 필수 입력 항목입니다.' })
  readonly name: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty({ message: '이메일ID는 필수 입력 항목입니다.' })
  readonly email: string;

  @IsNumberString()
  @IsNotEmpty({ message: '휴대폰 전화번호는 필수 입력 항목입니다.' })
  readonly phoneNumber: string;
}
