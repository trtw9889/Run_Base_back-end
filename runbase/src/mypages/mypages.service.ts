import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Order } from 'src/entities/orders.entity';
import { ProductSize } from 'src/entities/product_sizes.entity';
import { Product } from 'src/entities/products.entity';
import { ReviewsService } from 'src/reviews/reviews.service';
import { Image } from 'src/entities/images.entity';
import {
  PaymentProductDetail,
  PaymentList,
  serialNumberAndColorIds,
} from './interfaces/mypages.interface';
import { Size } from 'src/entities/sizes.entity';
import { Color } from 'src/entities/colors.entity';
import { Shipment } from 'src/entities/shipment.entity';
import { PasswordDto } from './dto/mypages.dto';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/entities/users.entity';

@Injectable()
export class MypagesService {
  constructor(
    private reviewsService: ReviewsService,
    private authService: AuthService,
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(ProductSize)
    private readonly productSizesRepository: Repository<ProductSize>,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(Image)
    private readonly imagesRepository: Repository<Image>,
    @InjectRepository(Size)
    private readonly sizesRepository: Repository<Size>,
    @InjectRepository(Color)
    private readonly colorsRepository: Repository<Color>,
    @InjectRepository(Shipment)
    private readonly shipmentsRepository: Repository<Shipment>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async getOrderNumber(userId: number) {
    return await this.ordersRepository.find({
      where: { userId },
    });
  }

  async getOrderProduct(userId: number) {
    const query = await this.ordersRepository
      .createQueryBuilder('orders')
      .leftJoinAndSelect('orders.orderProducts', 'orderProducts')
      .leftJoinAndSelect('orderProducts.orderStatus', 'order_status')
      .where({ userId })
      .getMany();

    const orderProducts = query.map((order) => order.orderProducts);

    return orderProducts;
  }

  async getProductSizes(productSizeIds: number[]) {
    return await this.productSizesRepository.find({
      where: {
        id: In(productSizeIds), //In 연산자를 사용하여 배열에 포함된 값과 일치하는 경우를 찾을 수 있음
      },
    });
  }

  async getSizeInfo(sizeIds: number[]) {
    return await this.sizesRepository.find({
      where: { id: In(sizeIds) },
    });
  }

  async getColorInfo(colorIds: number[]) {
    return await this.colorsRepository.find({
      where: { id: In(colorIds) },
    });
  }

  async getProductInfo(productIds: number[]) {
    return this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.categories', 'categories')
      .leftJoinAndSelect('product.genders', 'genders')
      .leftJoinAndSelect('product.productSizes', 'productSizes')
      .whereInIds(productIds)
      .getMany();
  }

  async getOrderByProduct(userId: number) {
    return await this.ordersRepository
      .createQueryBuilder('orders')
      .leftJoinAndSelect('orders.orderProducts', 'order_products')
      .where({ userId })
      .getMany();
  }

  async getShipmentList(userId: number) {
    return await this.shipmentsRepository.find({ where: { userId } });
  }

  async getProductImages(serialNumberAndColorId: serialNumberAndColorIds[]) {
    const imageInfo = serialNumberAndColorId.map(async (data) => {
      return await this.imagesRepository.findOne({
        where: data,
      });
    });

    return Promise.all(imageInfo); //모든 이미지 검색 작업을 병렬로 실행하기 위해 Promise.all을 사용합니다. 이렇게 하면 모든 이미지 검색 작업이 완료되고 결과가 배열로 반환됩니다.
  }

  async getPaymentsList(
    userId: number,
    page: number,
    perPage: number,
  ): Promise<PaymentList[]> {
    const order = await this.getOrderNumber(userId);

    const orderProducts = await this.getOrderProduct(userId); //orderProduct 가지고 오는 로직

    const flatOrderProducts = orderProducts.flat();

    const getOrderIds = await this.reviewsService.getOrderIds(userId); //[1,2]

    const getProductSizeIds =
      await this.reviewsService.getOrderedProductSizeIds(getOrderIds); //[36,500,611,568,619,421]

    const productSize = await this.getProductSizes(getProductSizeIds); //[{"id": 36, "productId": 4,sizeId": 6},

    const productIds = productSize.map((product) => product.productId); //[4,43,58,...]

    const product = await this.getProductInfo(productIds);

    const paymentsList = order.map((order) => {
      const matchingOrders = flatOrderProducts
        .filter((orders) => orders.orderId === order.id)
        .map((matchingOrder) => ({
          id: matchingOrder.id,
          productSizeId: matchingOrder.productSizeId,
        }));

      const productSizeId = matchingOrders.map((order) =>
        productSize.find((product) => product.id === order.productSizeId),
      );

      const products = productSizeId
        .map((productSizeIds) => {
          return product
            .filter((product) => product.id === productSizeIds.productId)
            .map((matchingProduct) => ({
              productId: matchingProduct.id,
              name: matchingProduct.name,
              price: matchingProduct.price,
              serialNumber: matchingProduct.serialNumber,
              orderProductId: matchingOrders.find(
                (order) => order.productSizeId === productSizeIds.id,
              ).id,
            }));
        })
        .flat()
        .sort((a, b) => a.orderProductId - b.orderProductId);

      const orderInfo = {
        id: order.id,
        userId: order.userId,
        orderNumber: order.orderNumber,
        products,
      };

      return orderInfo;
    });

    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const getSlicedProduct = paymentsList.slice(startIndex, endIndex);

    return getSlicedProduct;
  }

  async getPaymentsDetail(
    userId: number,
    orderId: number,
  ): Promise<PaymentProductDetail[]> {
    const order = await this.getOrderNumber(userId); //order 정보

    const productByOrderId = order.filter((order) => order.id === orderId);

    const shipment = await this.getShipmentList(userId);

    const orderProducts = await this.getOrderProduct(userId); //orderProduct 가지고 오는 로직

    const flatOrderProducts = orderProducts.flat(); // [[ ], [ ]] -> [] 하나의 배열로 만들어주는 메서드

    const getOrderIds = await this.reviewsService.getOrderIds(userId); //[1,2]

    const getProductSizeIds =
      await this.reviewsService.getOrderedProductSizeIds(getOrderIds); //[36,500,611,568,619,421]

    const productSize = await this.getProductSizes(getProductSizeIds); //[{"id": 36, "productId": 4,sizeId": 6},

    const sizeIds = productSize.map((productSizes) => productSizes.sizeId); //[6,1,12,15]

    const sizeInfo = await this.getSizeInfo(sizeIds); //[Size { id: 1, name: '220' }, ...]

    const productIds = productSize.map((product) => product.productId); //[4,43,58,...]

    const product = await this.getProductInfo(productIds);

    const colorIds = product.map((products) => products.colorId); //[2,1,5,3]

    const colorInfo = await this.getColorInfo(colorIds); //[{"id": 1,"name": "white"},...]

    const serialNumberAndColorId = product.map((product) => ({
      serialNumber: product.serialNumber,
      colorId: product.colorId,
    })); //[{ serialNumber: 's2', colorId: 2 }, ...]

    const image = await this.getProductImages(serialNumberAndColorId); //serialNumberAndColorId을 이용해 조건에 알맞은 url 중 한 개 뽑아오는 로직

    const productDetail = product.map((product) => {
      const productUrl = image.find(
        (image) =>
          product.serialNumber === image.serialNumber &&
          product.colorId === image.colorId,
      );

      const productColor = colorInfo.find(
        (color) => color.id === product.colorId,
      );

      return {
        id: product.id,
        name: product.name,
        category: product.categories.name,
        gender: product.genders ? product.genders.name : null,
        price: product.price,
        imageUrl: productUrl.url,
        color: productColor.name,
        productSizes: product.productSizes,
      };
    });

    const orderProduct = flatOrderProducts.map((orderProduct) => {
      const productSizeId = orderProduct.productSizeId;

      const productSizeInfo = productSize.find(
        (productSize) => productSize.id === productSizeId,
      ); //배열의 형태가 아닌 조건에 맞는 객체 형태로 반환

      const productId = productSizeInfo.productId;

      const product = productDetail.find((product) => product.id === productId);

      const orderProductInfo = flatOrderProducts.find(
        (order) => order.productSizeId === productSizeId,
      );

      const sizeName = sizeInfo.find(
        (size) => size.id === productSizeInfo.sizeId,
      );

      const purchasePrice = product.price * orderProductInfo.productQuantity;

      return {
        orderId: orderProductInfo.orderId,
        productId: product.id,
        name: product.name,
        category: product.category,
        gender: product.gender,
        imageUrl: product.imageUrl,
        color: product.name,
        size: sizeName.name,
        quantity: orderProductInfo.productQuantity,
        purchasePrice: purchasePrice,
      };
    });

    const productsInfo = orderProduct.filter(
      (product) => product.orderId === orderId,
    );

    const orderInfos = productByOrderId.map((order) => {
      const createdAtDate = new Date(order.createdAt); // string -> Date 객체로 파싱(날짜를 문자열로 처리하면 다양한 날짜 및 시간 관련 작업을 수행하기가 어려워서)

      const date = `${createdAtDate.getFullYear()}-${String(
        createdAtDate.getMonth() + 1,
      ).padStart(2, '0')}-${String(createdAtDate.getDate()).padStart(2, '0')}`;

      const status = flatOrderProducts
        .filter((products) => products.orderId === order.id)
        .map((status) => status.orderStatus.name);

      const [shipmentInfo] = shipment
        .filter((shipment) => shipment.id === order.shipmentId)
        .map((address) => `${address.streetAddress} ${address.detailAddress}`);

      return {
        orderId: order.id,
        userId: order.userId,
        totalPrice: Number(order.totalPrice),
        orderNumber: order.orderNumber,
        orderDate: date,
        paymentsMethod: '바로결제',
        orderStatus: status[0], //배송이 한 번에 이우러 진다는 가정하에 작업 , 나뉘어서 배송이 이루어질 경우는 달라지는 로직
        address: shipmentInfo,
        productsInfo,
      };
    });

    return orderInfos;
  }

  async checkPassword(userId: number, checkPassword: PasswordDto) {
    const { password } = checkPassword;

    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    const validatePassword = await this.authService.validatePassword(
      password,
      user.password,
    );

    if (!validatePassword) {
      throw new UnauthorizedException('비밀번호를 확인해주세요');
    }
  }

  async updatePassword(userId: number, updatePassword: PasswordDto) {
    const { password } = updatePassword;

    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    const checkedPassword = await this.authService.validatePassword(
      password,
      user.password,
    );

    if (checkedPassword) {
      throw new UnauthorizedException('기존 비밀번호와 동일합니다.');
    }

    const newHashedPassword = await this.authService.transformPassword(
      password,
    );

    user.password = newHashedPassword;

    return this.usersRepository.save(user);
  }
}
