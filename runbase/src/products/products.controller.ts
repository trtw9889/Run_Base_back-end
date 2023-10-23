import {
  Controller,
  Get,
  Param,
  UseFilters,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductResult, Products } from './interfaces/product.interface';
import { HttpExceptionFilter } from 'src/utils/http-exception.filter';

@Controller('products')
@UseFilters(HttpExceptionFilter)
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get('new')
  async getNewProduct(
    @Query('page') page: number,
    @Query('perPage') perPage: number,
  ): Promise<Products[]> {
    return this.productsService.getNewProduct(page, perPage);
  }

  @Get('clothes')
  async getProductsByClothes(
    @Query('page') page: number,
    @Query('perPage') perPage: number,
  ): Promise<Products[]> {
    return this.productsService.getProductsByClothes(page, perPage);
  }

  @Get('shoes')
  async getProductsByShoes(
    @Query('page') page: number,
    @Query('perPage') perPage: number,
  ): Promise<Products[]> {
    return this.productsService.getProductsByShoes(page, perPage);
  }

  @Get('goods')
  async getProductsByGoods(
    @Query('page') page: number,
    @Query('perPage') perPage: number,
  ): Promise<Products[]> {
    return this.productsService.getProductsByGoods(page, perPage);
  }

  @Get('sort/:categoryId')
  async sortAndFilterProducts(
    @Param('categoryId') categoryId: number,
    @Query('page') page: number,
    @Query('perPage') perPage: number,
    @Query('sorting') sorting: string,
    @Query('color') color: string,
    @Query('minPrice') minPrice: string,
    @Query('maxPrice') maxPrice: string,
    @Query('size') size: string,
    @Query('gender') gender: number,
  ): Promise<Products[]> {
    const colors = color ? color.split(',').map((id) => parseInt(id)) : [];
    const sizes = size ? size.split(',').map((id) => parseInt(id)) : [];

    return this.productsService.sortAndFilterProducts(
      categoryId,
      page,
      perPage,
      sorting,
      colors,
      minPrice ? minPrice : null,
      maxPrice ? maxPrice : null,
      sizes,
      gender,
    );
  }

  @Get('/:id')
  async getProductsById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ProductResult> {
    return this.productsService.getProductsById(id);
  }
}
