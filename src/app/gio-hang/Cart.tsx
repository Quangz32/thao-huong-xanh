"use client";
import { ShoppingCart, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { deleteCartItem, getCart } from "@/services/CartService";
import { getProductDetail } from "@/services/ProductService";

export default function Cart() {
  const [cart, setCart] = useState<any[] | null>([]);

  useEffect(() => {
    setCart(getCart());
  }, []);

  const handleDeleteCartItem = (index: number) => {
    deleteCartItem(index);
    setCart(getCart());
  };

  const productNameMap = new Map<string, string>([
    ["xa-bong-kho-qua", "Khổ Qua"],
    ["xa-bong-nghe", "Nghệ"],
    ["xa-bong-vo-cam", "Cam"],
    ["xa-bong-tra-xanh", "Trà Xanh"],
    ["xa-bong-cam-thao", "Cam Thảo"],
  ]);

  const getComboLabel = (productIds: string[]) => {
    return productIds.map((id) => productNameMap.get(id)).join(", ");
  };

  return (
    <div className="border border-gray-300 rounded-xl p-6">
      <h2 className="pb-3 mb-3 font-medium text-xl border-b border-gray-300">
        Giỏ hàng của bạn
      </h2>

      {/* Items */}
      {(cart == null || cart.length == 0) && (
        <>
          <span className="text-orange-500">Giỏ hàng trống</span>
          <a href="/" className="flex">
            <ShoppingCart className="mr-3 "></ShoppingCart>
            <span>Đến xem sản phẩm</span>
          </a>
        </>
      )}
      {cart?.map((item, index) => {
        const fullItem = getProductDetail(item.productId);
        return (
          <div key={index} className="flex py-2">
            <div>
              <a href={`/san-pham/${item.productId}`}>
                <img
                  src={fullItem.img}
                  className="w-20 h-20 rounded-md mr-6"
                  alt={fullItem.name}
                />
              </a>
            </div>
            <div className="flex-1 w-full">
              {/* Name & delete btn */}
              <div className="flex justify-between mb-3">
                <div className="flex flex-col">
                  <span className="text-lime-800 mr-4">{fullItem.name}</span>
                  {item.isCombo && (
                    <span className="text-sm text-gray-500">
                      {getComboLabel(item.productIds)}
                    </span>
                  )}
                </div>
                <button
                  className="text-current cursor-pointer"
                  onClick={() => {
                    handleDeleteCartItem(index);
                  }}
                >
                  <div className="flex">
                    <Trash2Icon className="text-gray-400" />
                    <span className="text-gray-400">Xoá</span>
                  </div>
                </button>
              </div>
              <div className="flex justify-between">
                {/* Edit quantity */}
                <div className="border w-16 flex item-center border-gray-300 bg-white rounded-full px-2 py-0.5">
                  <div className="">
                    <button className="cursor-pointer">-</button>
                    <input
                      className="w-6 text-center outline-none hide-arrow"
                      type="number"
                      value={item.quantity}
                    />
                    <button className="cursor-pointer">+</button>
                  </div>
                </div>
                {/* Price */}
                <div>
                  <span className="font-semibold text-orange-500">
                    {fullItem.price.toLocaleString("de-DE")}đ
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
