import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInUserDto } from './dto/signIn-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/signUp')
  async signUp(@Body() userData: CreateUserDto) {
    return this.usersService.signUp(userData);
  }

  @Post('/signIn')
  async signIn(@Body() signInData: SignInUserDto) {
    return this.usersService.signIn(signInData);
  }

  @Get('/checkEmail/:id')
  async checkEmail(@Param('id') id: string) {
    return this.usersService.checkEmail(id);
  }
}
