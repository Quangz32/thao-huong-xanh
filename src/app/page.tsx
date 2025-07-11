"use client";

import Layout from "@/components/Layout";
import ProductItem from "./ProductItem";
import products from "@/data/Product";
import comboes from "@/data/Combo";
import { useState } from "react";
import { Ban } from "lucide-react";

export default function Home() {
  return (
    <Layout>
      {/* Container */}
      <div className="">
        {/* Banner section */}
        <section>
          <img src="/img/banner-new.jpg" className="w-full"></img>
        </section>

        {/* Introduct section */}
        <section>
          <div className="max-w-7xl mt-8 mx-auto p-2">
            <h2 className="mb-4 text-4xl font-semibold">GIỚI THIỆU</h2>
            <p className="text-lg px-32 italic">
              Thảo Hương Xanh tự hào mang đến dòng xà bông dược liệu GreenS+ với
              thành phần hoàn toàn tự nhiên từ khổ qua, trà xanh, nghệ, vỏ cam,
              cam thảo... giúp làm sạch dịu nhẹ và nuôi dưỡng làn da khỏe mạnh.
              Sản phẩm có dạng bánh lẻ và combo 2–3 chiếc được đóng gói đẹp mắt,
              thích hợp làm quà tặng. Đặc biệt, combo còn được tặng kèm xơ mướp
              tắm và bao bì thân thiện với môi trường.
            </p>
          </div>
        </section>

        {/* Product section */}
        <section>
          <div className="max-w-7xl mt-8 mx-auto p-2">
            <div className="mb-4 text-4xl font-semibold">SẢN PHẨM</div>

            {/* Single product */}
            <div className="mb-4 text-2xl font-medium">
              Chọn một - Chăm sóc riêng (Bánh lẻ)
            </div>

            <div className="mb-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {products.map((product) => (
                <ProductItem key={product.id} product={product} />
              ))}
            </div>

            {/* Combo product */}
            <div className="mb-4 text-2xl font-medium">
              Combo Lành (Gói 2 và 3 bánh)
            </div>

            <div className="mb-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {comboes.map((product) => (
                <ProductItem
                  key={product.id}
                  product={product}
                  imgRatio={"[5/4]"}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
