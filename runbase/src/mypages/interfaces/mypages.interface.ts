export interface serialNumberAndColorIds {
  serialNumber: string;
  colorId: number;
}

export interface Product {
  productId: number;
  name: string;
  price: number;
  serialNumber: string;
  orderProductId: number;
}

export interface PaymentList {
  id: number;
  userId: number;
  orderNumber: string;
  products: Product[];
}

export interface ProductInfo {
  orderId: number;
  productId: number;
  name: string;
  category: string;
  gender: string | null;
  imageUrl: string;
  color: string;
  size: string;
  quantity: number;
  purchasePrice: number;
}

export interface PaymentProductDetail {
  orderId: number;
  userId: number;
  totalPrice: number;
  orderNumber: string;
  orderDate: string;
  paymentsMethod: string;
  orderStatus: string;
  address: string;
  productsInfo: ProductInfo[];
}
