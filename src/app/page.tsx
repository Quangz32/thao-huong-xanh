"use client";

import Layout from "@/components/Layout";
import ProductItem from "./ProductItem";
import products from "@/data/Product";
import comboes from "@/data/Combo";
import { useState, useEffect } from "react";
import { Ban } from "lucide-react";

export default function Home() {
  // Xử lý scroll đến section khi có hash trong URL
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const sectionId = hash.substring(1); // Loại bỏ ký tự #
      const element = document.getElementById(sectionId);
      if (element) {
        // Delay một chút để đảm bảo page đã render xong
        setTimeout(() => {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      }
    }
  }, []);

  return (
    <Layout>
      {/* Container */}
      <div className="">
        {/* Banner section */}
        <section>
          <img src="/img/banner-new.jpg" className="w-full"></img>
        </section>

        {/* Introduct section */}
        <section id="gioi-thieu">
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
        <section id="san-pham">
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
