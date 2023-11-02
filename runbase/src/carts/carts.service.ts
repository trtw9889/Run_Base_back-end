import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Cart } from 'src/entities/carts.entity';
import { ProductSize } from 'src/entities/product_sizes.entity';
import { Product } from 'src/entities/products.entity';
import { Category } from 'src/entities/categories.entity';
import { Size } from 'src/entities/sizes.entity';
import { Color } from 'src/entities/colors.entity';
import { Image } from 'src/entities/images.entity';
import { AddCartsDto } from './cartsDto';
import { Gender } from 'src/entities/genders.entity';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart)
    private cartsRepository: Repository<Cart>,
    @InjectRepository(ProductSize)
    private product_sizesRepository: Repository<ProductSize>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Gender)
    private gendersRepository: Repository<Gender>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(Size)
    private sizesRepository: Repository<Size>,
    @InjectRepository(Color)
    private colorsRepository: Repository<Color>,
    @InjectRepository(Image)
    private imagesRepository: Repository<Image>,
  ) {}

  async getCartsData(userId: number): Promise<Cart[]> {
    const carts = await this.cartsRepository
      .createQueryBuilder('cart')
      .select(['cart.id', 'cart.productSizeId', 'cart.quantity'])
      .where('cart.userId = :userId', { userId })
      .getMany();
    return carts;
  }

  async getProductSizes(productSizeIds: number[]): Promise<ProductSize[]> {
    return this.product_sizesRepository
      .createQueryBuilder('productSize')
      .select(['productSize.productId', 'productSize.sizeId', 'productSize.id'])
      .whereInIds(productSizeIds)
      .getMany();
  }

  async getProducts(productIds: number[]): Promise<Product[]> {
    return this.productsRepository
      .createQueryBuilder('product')
      .select([
        'product.id',
        'product.name',
        'product.price',
        'product.genderId',
        'product.categoryId',
        'product.colorId',
        'product.serialNumber',
      ])
      .whereInIds(productIds)
      .getMany();
  }

  async getColors(colorIds: number[]): Promise<Color[]> {
    return this.colorsRepository
      .createQueryBuilder('color')
      .select(['color.id', 'color.name'])
      .whereInIds(colorIds)
      .getMany();
  }

  async getCategories(categoryIds: number[]): Promise<Category[]> {
    return this.categoriesRepository
      .createQueryBuilder('category')
      .select(['category.id', 'category.name'])
      .whereInIds(categoryIds)
      .getMany();
  }

  async getGenders(categoryIds: number[]): Promise<Gender[]> {
    return this.gendersRepository
      .createQueryBuilder('gender')
      .select(['gender.id', 'gender.name'])
      .whereInIds(categoryIds)
      .getMany();
  }

  async getSerialNumbers(productIds: number[]): Promise<string[]> {
    const products = await this.productsRepository
      .createQueryBuilder('product')
      .select(['product.id', 'product.serialNumber'])
      .where('product.id IN (:...productIds)', { productIds })
      .getMany();

    return products.map((product) => product.serialNumber);
  }

  async getImages(serialNumbers: string[]): Promise<Image[]> {
    return this.imagesRepository
      .createQueryBuilder('image')
      .select(['image.id', 'image.colorId', 'image.url'])
      .where('image.serialNumber IN (:...serialNumbers)', { serialNumbers })
      .getMany();
  }

  async findCartsByUserId(userId: number) {
    try {
      const carts = await this.getCartsData(userId);

      const productSizeIds = carts.map((cart) => cart.productSizeId);

      const productSizes = await this.getProductSizes(productSizeIds);

      const productIds = productSizes.map(
        (productSize) => productSize.productId,
      );
      const sizeIds = productSizes.map((productSize) => productSize.sizeId);

      const productSizeName = await this.sizesRepository.find({
        where: { id: In(sizeIds) },
      });

      const products = await this.getProducts(productIds);
      // products 배열에서 genderIds와 categoryIds 를 map으로 추출해서 각각 변수에 담은 뒤
      // gender, category repository에서 각 Id값에 맞는 값들을 추출해낸다.
      // 그 변수들을 활용해 combined에 적용

      const categoryIds = products.map((product) => product.categoryId);

      const categories = await this.getCategories(categoryIds);

      const genderIds = products.map((product) => product.genderId);

      const genders = await this.getGenders(genderIds);

      const colorIds = products.map((product) => product.colorId);

      const colors = await this.getColors(colorIds);

      const serialNumbers = await this.getSerialNumbers(productIds);

      const images = await this.getImages(serialNumbers);

      const combinedData = carts.map((cart) => {
        const productSize = productSizes.find(
          (ps) => ps.id === cart.productSizeId,
        );

        const SizeName = productSizeName.find(
          (productsize) => productsize.id === productSize.sizeId,
        );

        const product = products.find(
          (product) => product.id === productSize.productId,
        );

        const productPrice = product.price * cart.quantity;

        const color = colors.find((color) => color.id === product.colorId);

        const image = images.find((image) => image.colorId === color.id);

        const category = categories.find(
          (category) => category.id === product.categoryId,
        );

        const gender = genders.find((gender) => gender.id === product.genderId);

        return {
          userId,
          cartId: cart.id,
          productSizeId: cart.productSizeId,
          quantity: cart.quantity,
          productId: product.id,
          productName: product.name,
          productSize: SizeName.name,
          productPrice: productPrice,
          productColor: color.name,
          imageUrl: image.url,
          productCategory: category.name,
          productGender: gender,
        };
      });
      combinedData.sort((a, b) => a.cartId - b.cartId);
      const totalPrice = combinedData
        .map((product) => product.productPrice)
        .reduce((acc, cur) => acc + cur, 0);
      return [...combinedData, { totalPrice: totalPrice }];
    } catch (error) {
      throw new NotFoundException(`장바구니가 비어 있습니다.`);
    }
  }

  async addCartItem(userId: number, addCartsDto: AddCartsDto) {
    const { productId, sizeId } = addCartsDto;
    try {
      // ProductSize의 id를 찾기 위해 Product id와 Size id를 이용
      const productSize = await this.product_sizesRepository.findOne({
        where: { productId, sizeId },
      });

      // 이미 장바구니에 해당 제품이 존재하는지 확인
      const existingCartItem = await this.cartsRepository.findOne({
        where: { productSizeId: productSize.id },
      });

      if (existingCartItem) {
        if (existingCartItem.quantity >= 5) {
          // 이미 quantity가 5 이상일 때 증가 불가
          throw new BadRequestException('수량은 5개까지만 가능합니다.');
        }
        // 이미 존재하는 장바구니 아이템인 경우 수량을 하나 증가
        existingCartItem.quantity += 1;
        await this.cartsRepository.save(existingCartItem);
      } else {
        // 장바구니에 아이템을 추가합니다.
        const newCartItem = new Cart();
        newCartItem.userId = userId;
        newCartItem.productSizeId = productSize.id;
        newCartItem.quantity = 1;
        await this.cartsRepository.save(newCartItem);
      }
    } catch (error) {
      console.error(error);
      throw new NotFoundException('예외 에러메세지 출력');
    }
  }

  async updateCartItemQuantity(
    userId: number,
    id: number,
    quantity: number,
  ): Promise<Cart> {
    //수량은 1~5개로 제한
    if (quantity < 1 || quantity > 5) {
      //Bad Request" (HTTP 상태 코드 400) 오류를 반환
      throw new BadRequestException('수량이 1과 5 사이의 값이어야 합니다.');
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

    await this.cartsRepository.delete({ id });
  }
}
