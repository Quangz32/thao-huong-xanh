"use client";

import Layout from "@/components/Layout";
import { getCart, addToCart, clearCart, deleteCartItem } from "@/services/CartService";
import { getProductDetail } from "@/services/ProductService";
import { HomeIcon, ShoppingCart, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import DeliveryInformation from "./DeliveryInformation";

export default function Page() {
  const BREAD_CRUMB_PARTS = ["Trang chủ", "Giỏ hàng"];
  const [cart, setCart] = useState<any[] | null>([]);

  const handleDeleteCartItem = (productId: string) => {
    deleteCartItem(productId);
    setCart(getCart);
  };

  useEffect(() => {
    setCart(getCart());
  }, []);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="mx-2 mb-4">
          <div className="flex flex-row items-center mt-2 mb-6">
            <HomeIcon color="#738136" className="inline-block mr-4" />
            {BREAD_CRUMB_PARTS.map((part, index) => (
              <span key={index}>
                <span
                  className={` ${
                    index === BREAD_CRUMB_PARTS.length - 1 ? "text-[#3e6807]" : "text-[#738136]"
                  }`}
                >
                  {part}
                </span>
                {index < BREAD_CRUMB_PARTS.length - 1 && (
                  <span className="text-[#738136] mx-3">/</span>
                )}
              </span>
            ))}
          </div>

          <div className="flex flex-col-reverse md:flex-row">
            {/* Form (Address...) */}
            <div className="md:w-3/5 mr-4">
              <DeliveryInformation />
            </div>
            {/* Cart Items */}
            <div className="md:w-2/5">
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
                        <img
                          src={fullItem.img}
                          className="w-20 h-20 rounded-md mr-6"
                          alt={fullItem.name}
                        />
                      </div>
                      <div className="flex-1 w-full">
                        {/* Name & delete btn */}
                        <div className="flex justify-between mb-3">
                          <span className="text-lime-800 mr-4">
                            {fullItem.name}
                          </span>
                          <button
                            className="text-current cursor-pointer"
                            onClick={() => {
                              handleDeleteCartItem(item.productId);
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
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
