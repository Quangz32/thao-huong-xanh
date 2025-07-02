import Layout from "@/components/Layout";
import Image from "next/image";
import ProductItem from "./ProductItem";
import products from "@/data/Product";
import comboes from "@/data/Combo";

export default function Home() {
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
                <ProductItem product={product} />
              ))}
            </div>

            {/* Combo product */}
            <div className="mb-4 text-2xl font-medium">Combo Lành (Gói 2 và 3 bánh)</div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {comboes.map((product) => (
                <ProductItem product={product} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
