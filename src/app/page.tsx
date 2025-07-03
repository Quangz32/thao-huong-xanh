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

        {/* Product section */}
        <section>
          <div className="max-w-7xl mt-8 mx-auto p-2">
            <div className="mb-4 text-4xl font-semibold">SẢN PHẨM</div>

            {/* Single product */}
            <div className="mb-4 text-2xl font-medium">Chọn một - Chăm sóc riêng (Bánh lẻ)</div>

            <div className="mb-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {products.map((product) => (
                <ProductItem key={product.id} product={product} />
              ))}
            </div>

            {/* Combo product */}
            <div className="mb-4 text-2xl font-medium">Combo Lành (Gói 2 và 3 bánh)</div>

            <div className="mb-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {comboes.map((product) => (
                <ProductItem key={product.id} product={product} imgRatio={"[5/4]"} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
