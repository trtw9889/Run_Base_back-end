import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from 'src/entities/carts.entity';
import { ProductSize } from 'src/entities/product_sizes.entity';
import { Product } from 'src/entities/products.entity';
import { Category } from 'src/entities/categories.entity';
import { Size } from 'src/entities/sizes.entity';
import { Color } from 'src/entities/colors.entity';
import { Image } from 'src/entities/images.entity';
import { AddCartsDto, GetCartsDto } from './cartsDto';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart)
    private cartsRepository: Repository<Cart>,
    @InjectRepository(ProductSize)
    private product_sizesRepository: Repository<ProductSize>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(Size)
    private sizesRepository: Repository<Size>,
    @InjectRepository(Color)
    private colorsRepository: Repository<Color>,
    @InjectRepository(Image)
    private imagesRepository: Repository<Image>,
  ) {}

  private async getCartsData(userId: number): Promise<Cart[]> {
    const carts = await this.cartsRepository
      .createQueryBuilder('cart')
      .select(['cart.id', 'cart.productSizeId', 'cart.quantity'])
      .where('cart.userId = :userId', { userId })
      .getMany();
    return carts;
  }

  private async getProductSizes(
    productSizeIds: number[],
  ): Promise<ProductSize[]> {
    return this.product_sizesRepository
      .createQueryBuilder('productSize')
      .select(['productSize.productId', 'productSize.sizeId', 'productSize.id'])
      .whereInIds(productSizeIds)
      .getMany();
  }

  private async getProducts(productIds: number[]): Promise<Product[]> {
    return this.productsRepository
      .createQueryBuilder('product')
      .select([
        'product.id',
        'product.name',
        'product.price',
        'product.colorId',
        'product.serialNumber',
      ])
      .whereInIds(productIds)
      .getMany();
  }

  private async getColors(colorIds: number[]): Promise<Color[]> {
    return this.colorsRepository
      .createQueryBuilder('color')
      .select(['color.id', 'color.name'])
      .whereInIds(colorIds)
      .getMany();
  }

  private async getSerialNumbers(productIds: number[]): Promise<string[]> {
    const products = await this.productsRepository
      .createQueryBuilder('product')
      .select(['product.id', 'product.serialNumber'])
      .where('product.id IN (:...productIds)', { productIds })
      .getMany();

    return products.map((product) => product.serialNumber);
  }

  private async getImages(serialNumbers: string[]): Promise<Image[]> {
    return this.imagesRepository
      .createQueryBuilder('image')
      .select(['image.id', 'image.colorId', 'image.url'])
      .where('image.serialNumber IN (:...serialNumbers)', { serialNumbers })
      .getMany();
  }

  async findCartsByUserId(userId: number): Promise<GetCartsDto[]> {
    try {
      const carts = await this.getCartsData(userId);

      const productSizeIds = carts.map((cart) => cart.productSizeId);

      const productSizes = await this.getProductSizes(productSizeIds);

      const productIds = productSizes.map(
        (productSize) => productSize.productId,
      );

      const products = await this.getProducts(productIds);

      const colorIds = products.map((product) => product.colorId);

      const colors = await this.getColors(colorIds);

      const serialNumbers = await this.getSerialNumbers(productIds);

      const images = await this.getImages(serialNumbers);

      const combinedData = carts.map((cart) => {
        const productSize = productSizes.find(
          (ps) => ps.id === cart.productSizeId,
        );

        const product = products.find((p) => p.id === productSize.productId);

        const color = colors.find((c) => c.id === product.colorId);

        const image = images.find((i) => i.colorId === color.id);

        return {
          userId,
          cartId: cart.id,
          productSizeId: cart.productSizeId,
          quantity: cart.quantity,
          productId: product.id,
          productName: product.name,
          productPrice: product.price,
          productColor: color.name,
          imageUrl: image.url,
        };
      });
      return combinedData;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async addCartItem(userId: number, addCartsDto: AddCartsDto) {
    const { productId, sizeId } = addCartsDto;
    try {
      // ProductSize의 id를 찾기 위해 Product id와 Size id를 이용
      const productSize = await this.product_sizesRepository.findOne({
        where: { productId, sizeId },
      });

      // 이미 카트에 해당 제품이 존재하는지 확인
      const existingCartItem = await this.cartsRepository.findOne({
        where: { productSizeId: productSize.id },
      });

      if (existingCartItem) {
        // 이미 존재하는 카트 아이템인 경우 수량을 증가
        existingCartItem.quantity += 1;
        await this.cartsRepository.save(existingCartItem);
      } else {
        // 카트에 아이템을 추가합니다.
        const newCartItem = new Cart();
        newCartItem.userId = userId;
        newCartItem.productSizeId = productSize.id;
        newCartItem.quantity = 1;
        await this.cartsRepository.save(newCartItem);
      }
    } catch (error) {
      console.error(error);
      throw new NotFoundException(error.message);
    }
  }

  async updateCartItemQuantity(
    userId: number,
    id: number,
    quantity: number,
  ): Promise<Cart> {
    //수량은 1~10개로 제한
    if (quantity < 1 || quantity > 10) {
      //Bad Request" (HTTP 상태 코드 400) 오류를 반환
      throw new BadRequestException('수량이 1과 10 사이의 값이어야 합니다.');
    }

    const cartItem = await this.cartsRepository.findOne({
      where: { id, userId },
    });

    if (!cartItem) {
      //Not Found" (HTTP 상태 코드 404) 오류를 반환
      throw new NotFoundException('카트에 물건이 없습니다.');
    }

    cartItem.quantity = quantity;
    return await this.cartsRepository.save(cartItem);
  }

  async deleteCartItem(userId: number, id: number) {
    const cart = await this.cartsRepository.findOne({
      where: { id: id, userId: userId },
    });

    if (!cart) {
      throw new NotFoundException(
        '해당 아이템이 사용자의 카트에 존재하지 않습니다.',
      );
    }

    return await this.cartsRepository.delete({ id });
  }
}
