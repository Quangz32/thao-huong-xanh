interface Product {
  id: string;
  name: string;
  img: string;
  price: number;
}

interface Props {
  product: Product;
  imgRatio?: String;
}

export default function ProductItem({ product, imgRatio = "square" }: Props) {
  // if (!imgRatio) imgRatio = "square";

  return (
    <div className="pt-6 pr-6 pb-1 pl-6 border-[1px] border-gray-200 rounded-xl">
      <a href="/san-pham" className="cursor-pointer">
        <img src={product.img} className={`mb-3 aspect-${imgRatio}`} />
      </a>
      <h3 className="font-medium mb-3">
        <a href="/san-pham" className="cursor-pointer">
          {product.name}
          {/* Xà Bông Dược Liệu Khổ Qua (100g) */}
        </a>
      </h3>
      <div className="text-orange-700 font-semibold mb-2 text-lg">
        {product.price.toLocaleString("de-DE")}
        <sup>đ</sup>
      </div>
    </div>
  );
}
