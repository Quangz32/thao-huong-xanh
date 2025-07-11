"use client";

import Layout from "@/components/Layout";
import { getCart, addToCart, clearCart, deleteCartItem } from "@/services/CartService";
import { getProductDetail } from "@/services/ProductService";
import { HomeIcon, ShoppingCart, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import DeliveryInformation from "./DeliveryInformation";
import Cart from "./Cart";

export default function Page() {
  const BREAD_CRUMB_PARTS = ["Trang chủ", "Giỏ hàng"];

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
                    index === BREAD_CRUMB_PARTS.length - 1
                      ? "text-[#3e6807]"
                      : "text-[#738136]"
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
              <Cart />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
