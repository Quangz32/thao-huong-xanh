export default function ProductItem() {
  return (
    <div className="p-6 border-[1px] border-gray-200 rounded-xl">
      <a href="/san-pham" className="cursor-pointer">
        <img src="/img/product/kho-qua.png" className="mb-3" />
      </a>
      <h3 className="font-medium mb-3">
        <a href="/san-pham" className="cursor-pointer">
          Xà Bông Dược Liệu Khổ Qua (100g)
        </a>
      </h3>
      <div className="text-orange-700 font-semibold mb-2 text-lg">
        59000<sup>đ</sup>
      </div>
    </div>
  );
}
