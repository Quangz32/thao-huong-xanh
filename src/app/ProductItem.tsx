interface Product {
  id: string;
  name: string;
  img: string;
  price: number;
}

export default function ProductItem({ product }: { product: Product }) {
  return (
    <div className="p-6 border-[1px] border-gray-200 rounded-xl">
      <a href="/san-pham" className="cursor-pointer">
        <img src="/img/product/kho-qua.png" className="mb-3" />
      </a>
      <h3 className="font-medium mb-3">
        <a href="/san-pham" className="cursor-pointer">
          {product.name}
          {/* Xà Bông Dược Liệu Khổ Qua (100g) */}
        </a>
      </h3>
      <div className="text-orange-700 font-semibold mb-2 text-lg">
        {product.price}
        <sup>đ</sup>
      </div>
    </div>
  );
}
