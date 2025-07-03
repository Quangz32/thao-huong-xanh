import products from "@/data/Product";
import productDetails from "@/data/ProductDetail";

// interface ProductDetail {
//   id: string;
//   name: string;
//   img: string;
//   price: number;
//   overview: [string];
//   info: string;
//   specification: any;
//   guide: [string];
//   note: [string];
// }

export function getProductDetail(productId: string): any {
  return productDetails.find((p) => p.id === productId);
}
