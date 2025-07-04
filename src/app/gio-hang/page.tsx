"use client";

import Layout from "@/components/Layout";
import { getCart, addToCart, clearCart } from "@/services/CartService";
import { getProductDetail } from "@/services/ProductService";
import { HomeIcon, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";

export default function Page() {
  const BREAD_CRUMB_PARTS = ["Trang chủ", "Giỏ hàng"];
  const [cart, setCart] = useState<any[]>([]);

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
              <h2 className="font-medium text-xl">Thông tin nhận hàng</h2>
              <form className="mt-4">
                {/* Name and Phone */}
                <div className="flex flex-row mb-4">
                  <div className="flex-1 mr-2">
                    <input
                      type="text"
                      id="fullName"
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      placeholder="Họ tên"
                      required
                    />
                  </div>
                  <div className="flex-1 ml-2">
                    <input
                      type="tel"
                      id="phoneNumber"
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      placeholder="Số điện thoại"
                      required
                    />
                  </div>
                </div>

                {/* Email and Address */}
                <div className="mb-4">
                  <input
                    type="email"
                    id="email"
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    placeholder="Địa chỉ email (để nhận thông tin đơn hàng)"
                  />
                </div>

                <div className="mb-4">
                  <input
                    type="text"
                    id="address"
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    placeholder="Địa chỉ (Ví dụ: 123 Hoàng Cầu)"
                    required
                  />
                </div>

                {/* Province, District, and Ward */}
                <div className="flex flex-row mb-4">
                  <div className="flex-1 mr-2">
                    <select
                      id="province"
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      required
                    >
                      <option value="">-- Chọn tỉnh/thành phố --</option>
                      <option value="Hanoi">Hà Nội</option>
                      <option value="HCM">TP. Hồ Chí Minh</option>
                    </select>
                  </div>
                  <div className="flex-1 mx-2">
                    <select
                      id="district"
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      required
                    >
                      <option value="">-- Chọn quận/huyện --</option>
                      <option value="HoanKiem">Hoàn Kiếm</option>
                      <option value="District1">Quận 1</option>
                    </select>
                  </div>
                  <div className="flex-1 ml-2">
                    <select
                      id="ward"
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      required
                    >
                      <option value="">-- Chọn Phường/Xã --</option>
                      <option value="HoanKiem">Phường A</option>
                      <option value="District1">Phường B</option>
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <textarea
                    id="note"
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    placeholder="Ghi chú thêm (Ví dụ: Giao giờ hành chính)"
                    rows={3}
                  />
                </div>

                <button
                  type="submit"
                  className="mt-4 w-full bg-orange-500 text-white font-medium py-2 rounded-md hover:bg-green-700"
                >
                  Xác nhận thông tin
                </button>
              </form>
            </div>
            {/* Cart Items */}
            <div className="md:w-2/5">
              <div className="border border-gray-300 rounded-xl p-6">
                <h2 className="pb-3 mb-3 font-medium text-xl border-b border-gray-300">
                  Giỏ hàng của bạn
                </h2>

                {/* Items */}
                {cart.map((item, index) => {
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
                      <div className="">
                        {/* Name & delete btn */}
                        <div className="flex justify-between mb-3">
                          <span className="text-lime-800 mr-4">{fullItem.name}</span>
                          <button className="text-current">
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
