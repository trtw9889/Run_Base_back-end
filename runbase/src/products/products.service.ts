import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from '../entities/products.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Color } from 'src/entities/colors.entity';
import { Image } from 'src/entities/images.entity';
import {
  ProductInfo,
  SizeInfo,
  ImageInfo,
  Products,
} from './interfaces/product.interface';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(Color)
    private readonly colorsRepository: Repository<Color>,
    @InjectRepository(Image)
    private readonly imagesRepository: Repository<Image>,
  ) {}

  async getImages() {
    return this.imagesRepository.find();
  }

  async getProducts() {
    return this.productsRepository.find();
  }

  async getAllProducts(page: number, perPage: number, sorting = '최신순') {
    let queryBuilder = await this.productsRepository
      .createQueryBuilder('products')
      .leftJoinAndSelect('products.productSizes', 'product_sizes')
      .leftJoinAndSelect('product_sizes.sizes', 'sizes')
      .orderBy('products.createdAt', 'DESC')
      .addOrderBy('products.id', 'ASC');

    if (sorting === '낮은가격순') {
      queryBuilder = queryBuilder.orderBy('products.price', 'ASC');
    } else if (sorting === '높은가격순') {
      queryBuilder = queryBuilder.orderBy('products.price', 'DESC');
    }

    const product = await queryBuilder.getMany();

    const images = await this.getImages();

    const serial = product.map((value) => value.serialNumber);

    const productColor = [];
    serial.forEach((serialNumber) => {
      const colorIds = images
        .filter((image) => image.serialNumber === serialNumber)
        .map((image) => image.colorId);

      productColor.push({
        serialNumber: serialNumber,
        colors: Array.from(new Set(colorIds)),
      });
    });

    const result = product.map((product) => ({
      id: product.id,
      name: product.name,
      categoryId: product.categoryId,
      genderId: product.genderId,
      price: Number(product.price),
      colorId: product.colorId,
      url: images.find(
        (image) =>
          image.colorId === product.colorId &&
          image.serialNumber === product.serialNumber,
      ).url,
      serialnumber: product.serialNumber,
      colors: productColor.find(
        (color) => color.serialNumber === product.serialNumber,
      ).colors,
      sizes: product.productSizes.map((productSize) => productSize.sizeId),
    }));

    return result;
  }

  async filterProducts(
    page: number,
    perPage: number,
    sorting: string,
    colors: number[],
    minPrice: string,
    maxPrice: string,
    sizes: number[],
    gender: number,
  ): Promise<Products[]> {
    const products = await this.getAllProducts(page, perPage, sorting);

    let filteredProducts = products;

    if (colors.length > 0 && !isNaN(colors[0])) {
      filteredProducts = products.filter((product) =>
        colors.includes(product.colorId),
      );
    }

    if (minPrice !== null && maxPrice != null) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.price >= Number(minPrice) && product.price < Number(maxPrice),
      );
    } else if (minPrice !== null) {
      const minPriceValue = Number(minPrice);
      filteredProducts = filteredProducts.filter(
        (product) => product.price >= minPriceValue,
      );
    }

    if (sizes.length > 0 && !isNaN(sizes[0])) {
      filteredProducts = filteredProducts.filter((product) =>
        sizes.some((size) => product.sizes.includes(size)),
      );
    }

    if (gender) {
      filteredProducts = filteredProducts.filter(
        (product) => product.genderId === gender,
      );
    }

    return filteredProducts;
  }

  async getNewProduct(page: number, perPage: number): Promise<Products[]> {
    const products = await this.getAllProducts(page, perPage);

    const startIndex = (page - 1) * perPage;
    const endIndex = Math.min(startIndex + perPage, 20);
    const newProduct = products.slice(startIndex, endIndex);

    return newProduct;
  }

  async getProductsByShoes(
    page: number,
    perPage: number,
    sorting: string,
    colors: number[],
    minPrice: string,
    maxPrice: string,
    sizes: number[],
    gender: number,
  ): Promise<Products[]> {
    const filterProduct = await this.filterProducts(
      page,
      perPage,
      sorting,
      colors,
      minPrice,
      maxPrice,
      sizes,
      gender,
    );

    const shoesProducts = filterProduct.filter(
      (product) => product.categoryId === 1,
    );

    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const slicedProduct = shoesProducts.slice(startIndex, endIndex);

    return slicedProduct;
  }

  async getProductsByClothes(
    page: number,
    perPage: number,
    sorting: string,
    colors: number[],
    minPrice: string,
    maxPrice: string,
    sizes: number[],
    gender: number,
  ): Promise<Products[]> {
    const filterProduct = await this.filterProducts(
      page,
      perPage,
      sorting,
      colors,
      minPrice,
      maxPrice,
      sizes,
      gender,
    );

    const clothesProducts = filterProduct.filter(
      (product) => product.categoryId === 2,
    );

    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const slicedProduct = clothesProducts.slice(startIndex, endIndex);

    return slicedProduct;
  }

  async getProductsByGoods(
    page: number,
    perPage: number,
    sorting: string,
    colors: number[],
    minPrice: string,
    maxPrice: string,
    sizes: number[],
    gender: number,
  ): Promise<Products[]> {
    const filterProduct = await this.filterProducts(
      page,
      perPage,
      sorting,
      colors,
      minPrice,
      maxPrice,
      sizes,
      gender,
    );

    const goodsProducts = filterProduct.filter(
      (product) => product.categoryId === 3,
    );

    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const slicedProduct = goodsProducts.slice(startIndex, endIndex);

    return slicedProduct;
  }

  async getProductsById(id: number): Promise<
    ProductInfo & {
      findSize: SizeInfo[];
      colors: string[];
      imageInfo: ImageInfo[];
    }
  > {
    const findProduct = await this.productsRepository
      .createQueryBuilder('products')
      .leftJoinAndSelect('products.categories', 'categories')
      .leftJoinAndSelect('products.colors', 'colors')
      .where('products.id = :id', { id })
      .getRawOne();

    if (!findProduct) {
      throw new NotFoundException(`Can't find Product with id ${id}`);
    }

    const {
      products_id: productId,
      categories_name: categoryName,
      products_serial_number: serialNumber,
      products_name: name,
      products_price: price,
      colors_name: color,
    } = findProduct;

    const productInfo = {
      productId,
      categoryName,
      serialNumber,
      name,
      price: parseInt(price),
      color,
    };

    const findSize = await this.productsRepository
      .createQueryBuilder('products')
      .leftJoinAndSelect('products.productSizes', 'product_sizes')
      .leftJoinAndSelect('product_sizes.sizes', 'sizes')
      .select('sizes.id', 'sizeId')
      .addSelect('sizes.name', 'sizes')
      .where('products.id = :id', { id })
      .getRawMany();

    const findSerial = await this.productsRepository.findOne({
      where: { id },
    });

    const serial = findSerial.serialNumber;

    const findColor = await this.colorsRepository
      .createQueryBuilder('colors')
      .leftJoinAndSelect('colors.images', 'images')
      .select('colors.id')
      .addSelect('colors.name')
      .where('images.serialNumber = :serial', { serial: serial })
      .getMany();

    const colors = findColor.map((color) => color.name);

    const findImages = await this.getImages();

    const filterImage = findImages.filter(
      (filterImage) => filterImage.serialNumber === serial,
    );

    const productBySerial = await this.getProducts();

    const imageInfo = filterImage.map((image) => {
      const { serialNumber, colorId, url } = image;

      const colorData = findColor.find((color) => color.id === colorId);
      const colorName = colorData ? colorData.name : '';

      const productData = productBySerial.find(
        (product) =>
          product.serialNumber === serialNumber &&
          product.colorId === colorData.id,
      );
      const productIdByImage = productData.id;

      return {
        productIdByImage,
        serialNumber,
        colorName,
        url,
      };
    });

    return { ...productInfo, findSize, colors, imageInfo };
  }
}
