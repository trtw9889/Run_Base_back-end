import {
  Controller,
  UseGuards,
  Get,
  Request,
  Query,
  Param,
  Body,
  Patch,
  Post,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { MypagesService } from './mypages.service';
import {
  PaymentProductDetail,
  PaymentList,
} from './interfaces/mypages.interface';
import { PasswordDto } from './dto/mypages.dto';

@Controller('mypages')
@UseGuards(AuthGuard)
export class MypagesController {
  constructor(private mypagesService: MypagesService) {}

  @Get('paymentsList')
  async getPaymentsList(
    @Request() request,
    @Query('page') page: number,
    @Query('perPage') perPage: number,
  ): Promise<PaymentList[]> {
    const userId = request.user.id;

    return this.mypagesService.getPaymentsList(userId, page, perPage);
  }

  @Get('paymentsDetail/:orderId')
  async getPaymentsDetail(
    @Request() request,
    @Param('orderId') orderId: number,
  ): Promise<PaymentProductDetail[]> {
    const userId = request.user.id;

    return this.mypagesService.getPaymentsDetail(userId, orderId);
  }

  @Post('check/password')
  async checkPassword(@Request() request, @Body() checkPassword: PasswordDto) {
    const userId = request.user.id;

    await this.mypagesService.checkPassword(userId, checkPassword);

    return { status: 200, message: 'ok' };
  }

  @Patch('update/password')
  async updatePassword(
    @Request() request,
    @Body() updatePassword: PasswordDto,
  ) {
    const userId = request.user.id;

    await this.mypagesService.updatePassword(userId, updatePassword);

    return { status: 200, message: '비밀번호가 정상적으로 변경되었습니다.' };
  }
}
