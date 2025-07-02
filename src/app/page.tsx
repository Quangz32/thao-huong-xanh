import Layout from "@/components/Layout";
import Image from "next/image";
import ProductItem from "./ProductItem";

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
          <div className="mt-8 mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-7xl">
            <ProductItem />
            <ProductItem />
            <ProductItem />
            <ProductItem />
          </div>
        </section>
      </div>
    </Layout>
  );
}
