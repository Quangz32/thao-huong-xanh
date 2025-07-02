import Layout from "@/components/Layout";
import Image from "next/image";
import ProductItem from "./ProductItem";
import products from "@/data/Product";

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
          <div className="mt-8 mx-auto p-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-7xl">
            {products.map((product) => (
              <ProductItem product={product} />
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}
