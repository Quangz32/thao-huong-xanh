"use client";

import Layout from "@/components/Layout";
import ProductItem from "./ProductItem";
import products from "@/data/Product";
import comboes from "@/data/Combo";
import { useState } from "react";
import { Ban } from "lucide-react";

export default function Home() {
  const [showChatIcons, setShowChatIcons] = useState(false);

  const toggleShowChatIcons = () => {
    setShowChatIcons(!showChatIcons);
  };

  return (
    <Layout>
      {/* Container */}
      <div className="">
        {/* Banner section */}
        <section>
          <img src="/img/banner.jpg" className="w-full h-[400px]"></img>
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

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {comboes.map((product) => (
                <ProductItem key={product.id} product={product} imgRatio={"[5/4]"} />
              ))}
            </div>
          </div>
        </section>

        {/* Chat  */}
        <div>
          <div className="fixed bottom-8 right-8 ">
            {/* icons */}
            {showChatIcons && (
              <div className="flex flex-col items-center space-y-2 mt-4">
                <a href="https://www.facebook.com/profile.php?id=61576923603831" target="_blank">
                  <button className="mb-2 bg-blue-500 text-white p-2 rounded-full shadow hover:scale-105 transition-transform">
                    <img src="/icon/messenger.svg" className="h-8 w-8" />
                  </button>
                </a>
              </div>
            )}

            {/* toggle */}
            <div className="h-12 w-12 flex items-center justify-center">
              {!showChatIcons && (
                <button
                  className="w-full h-full bg-[#326e51] text-white rounded-full shadow cursor-pointer hover:scale-[1.1]"
                  onClick={toggleShowChatIcons}
                >
                  <div className="flex flex-col items-center justify-center">
                    <img src="/icon/comments-solid.svg" className="h-6 w-6"></img>
                    <span className="text-[9px] font-semibold ">Liên hệ</span>
                  </div>
                </button>
              )}

              {showChatIcons && (
                <button
                  className="w-4/6 h-4/6 bg-[#326e51] rounded-full"
                  onClick={toggleShowChatIcons}
                >
                  <Ban className="w-full h-full" color="silver" />
                  {/* <img src="/icon/comments-solid.svg" className="h-6 w-6"></img> */}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
