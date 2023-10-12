import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductReview } from 'src/entities/product_reviews.entity';
import { ProductSize } from 'src/entities/product_sizes.entity';
import { Order } from 'src/entities/orders.entity';
import { OrderProduct } from 'src/entities/order_products.entity';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(ProductReview)
    private productReviewRepository: Repository<ProductReview>,
    @InjectRepository(ProductSize)
    private productSizeRepository: Repository<ProductSize>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderProduct)
    private orderProductRepository: Repository<OrderProduct>,
  ) {}

  //productId에 해당하는 productSizeId들을 배열로 만든다.
  async getProductSizeIds(productId: number): Promise<number[]> {
    const productSizeIds = await this.productSizeRepository
      .createQueryBuilder('product_size')
      .select('product_size.id')
      .where('product_size.product_id = :productId', { productId })
      .getMany()
      .then((productSizeIds) =>
        productSizeIds.map((productSize) => productSize.id),
      );

    return productSizeIds;
  }

  //userId에 해당하는 주문내역id들을 전부 배열로 만든다.
  async getOrderIds(userId: number): Promise<number[]> {
    const orderIds = await this.orderRepository
      .createQueryBuilder('orders')
      .select('orders.id')
      .where('orders.user_id = :userId', { userId })
      .getMany()
      .then((orderIds) => orderIds.map((order) => order.id));

    return orderIds;
  }

  //주문내역id들로 주문했던 product_size_id들을 불러온다.
  async getOrderedProductSizeIds(orderIds: number[]): Promise<number[]> {
    const orderedProductSizeIds = await this.orderProductRepository
      .createQueryBuilder('order_products')
      .where('order_products.order_id IN (:...orderIds)', { orderIds })
      .select(['order_products.product_size_id'])
      .getRawMany()
      .then((orderProducts) =>
        orderProducts.map((orderProduct) => orderProduct.product_size_id),
      );

    return orderedProductSizeIds;
  }

  async createReview(reviewData: CreateReviewDto) {
    const { userId, productId } = reviewData;

    const productSizeIds = await this.getProductSizeIds(productId);
    const orderIds = await this.getOrderIds(userId);
    const orderedProductSizeIds = await this.getOrderedProductSizeIds(orderIds);

    // 주문한 상품과 특정 상품의 product_size_id들 중 일치하는 것이 있는지 확인. PROMISE 방식으로 고쳐야하나 의견바람.
    const checkSameProduct = productSizeIds.some((productSizeId) =>
      orderedProductSizeIds.includes(productSizeId),
    );

    if (!checkSameProduct) {
      return { message: '구매한 내역이 없는 상품입니다.' };
    }

    const reviewCount = await this.productReviewRepository.find({
      where: { userId, productId },
    });

    if (1 <= reviewCount.length) {
      return {
        message:
          '이미 해당 제품에 대해 남긴 리뷰가 존재하여 요청이 거부됩니다. 리뷰 수정을 이용해주세요.',
      };
    }

    await this.productReviewRepository.save(reviewData);

    return { message: '리뷰를 작성하였습니다.' };
  }

  async getReview(productId: number, offset: number) {
    return await this.productReviewRepository.find({
      where: { productId },
      order: { id: 'DESC' },
      take: 5,
      skip: offset,
    });
  }

  async updateReview(reviewData: CreateReviewDto) {
    const { userId, productId } = reviewData;

    const productSizeIds = await this.getProductSizeIds(productId);
    const orderIds = await this.getOrderIds(userId);
    const orderedProductSizeIds = await this.getOrderedProductSizeIds(orderIds);

    const checkSameProduct = productSizeIds.some((productSizeId) =>
      orderedProductSizeIds.includes(productSizeId),
    );

    if (!checkSameProduct) {
      return { message: '구매한 내역이 없는 상품입니다.' };
    }

    const reviewCount = await this.productReviewRepository.find({
      where: { userId, productId },
    });

    if (reviewCount.length < 1) {
      return {
        message: '수정할 리뷰가 없습니다.',
      };
    }

    const reviewed = await this.productReviewRepository.findOne({
      where: { userId, productId },
      order: { id: 'DESC' },
    });

    await this.productReviewRepository.update({ id: reviewed.id }, reviewData);

    return { message: '리뷰를 수정하였습니다.' };
  }

  async deleteReview(userId: number, productId: number) {
    await this.productReviewRepository
      .createQueryBuilder()
      .delete()
      .from(ProductReview)
      .where('userId = :userId', { userId })
      .andWhere('productId = :productId', { productId })
      .execute();

    return { message: '리뷰를 삭제하였습니다.' };
  }
}
