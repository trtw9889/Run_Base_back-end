import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { ReviewInputDto } from './dto/input-review.dto';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(
    private readonly reviewsService: ReviewsService,
    private authService: AuthService,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  async createReview(@Request() req, @Body() reviewData: ReviewInputDto) {
    const userId = req.user.id;
    const data = { ...reviewData, userId: userId };

    return this.reviewsService.createReview(data);
  }

  @Get()
  async getReview(
    @Query('productId') productId: number,
    @Query('offset') offset: number,
  ) {
    return this.reviewsService.getReview(productId, offset);
  }

  @UseGuards(AuthGuard)
  @Put()
  async updateReview(@Request() req, @Body() reviewData: ReviewInputDto) {
    const userId = req.user.id;
    const data = { ...reviewData, userId: userId };

    return this.reviewsService.updateReview(data);
  }

  @UseGuards(AuthGuard)
  @Delete(':productId')
  async deleteReview(@Request() req, @Param('productId') productId: number) {
    const userId = req.user.id;

    return await this.reviewsService.deleteReview(userId, productId);
  }
}
