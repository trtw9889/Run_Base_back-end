import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/entities/users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInUserDto } from './dto/signIn-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private authService: AuthService,
  ) {}

  async signUp(userData: CreateUserDto) {
    const { name, email, password, phoneNumber } = userData;

    const checkEmail = await this.userRepository.findOne({ where: { email } });
    const checkPhoneNumber = await this.userRepository.findOne({
      where: { phoneNumber },
    });

    if (!!checkEmail || !!checkPhoneNumber) {
      throw new HttpException(
        '이미 가입된 이메일 또는 전화번호입니다.',
        HttpStatus.CONFLICT,
      );
    }

    const user = new User();

    const hashedPassword = await this.authService.transformPassword(password);

    user.name = name;
    user.email = email;
    user.password = hashedPassword;
    user.phoneNumber = phoneNumber;

    await this.userRepository.save(user);

    return { message: '회원가입이 완료되었습니다.' };
  }

  async signIn(signInData: SignInUserDto) {
    const { email, password } = signInData;

    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('입력된 정보가 올바르지 않습니다.');
    }

    const validateResult = await this.authService.validatePassword(
      password,
      user.password,
    );

    if (!validateResult) {
      throw new UnauthorizedException('입력된 정보가 올바르지 않습니다.');
    }

    return this.authService.signIn({
      id: user.id,
      email: user.email,
    });
  }

  async checkEmail(email: string) {
    const isDuplicate = await this.userRepository.findOne({
      where: { email },
    });

    if (isDuplicate !== null) {
      throw new HttpException('이미 가입된 이메일입니다.', HttpStatus.CONFLICT);
    }

    return { message: '가입 가능한 이메일입니다.' };
  }
}
