export interface ProductInfo {
  productId: number;
  categoryName: string;
  serialNumber: string;
  name: string;
  price: number;
  color: string;
}

export interface SizeInfo {
  sizeId: number;
  sizes: string;
}

export interface ImageInfo {
  productIdByImage: number;
  serialNumber: string;
  colorName: string;
  url: string;
}

export interface ProductResult {
  productId: number;
  categoryName: string;
  serialNumber: string;
  name: string;
  price: number;
  color: string;
  findSize: SizeInfo[];
  colors: string[];
  imageInfo: ImageInfo[];
}

export interface Products {
  id: number;
  name: string;
  categoryId: number;
  price: number;
  colorId: number;
  url: string;
  serialnumber: string;
  colors: number[];
}
