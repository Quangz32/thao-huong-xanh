"use client";

import Layout from "@/components/Layout";
import { HomeIcon } from "lucide-react";
import { getProductDetail } from "@/services/ProductService";
import { use, useState } from "react";
import { addToCart } from "@/services/CartService";
// import { useState } from "react";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const productDetail = getProductDetail(id);
  console.log(productDetail);

  const [quantity, setQuantity] = useState(1);

  const handleIncreaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleAddToCart = () => {
    addToCart(id, quantity);
  };

  const breadcrumbParts = ["Trang chủ", "Sản phẩm", " Xà Bông Dược Liệu Khổ Qua"];

  return (
    <Layout>
      {/* Container */}
      <div className="max-w-7xl  mx-auto">
        {/* BreadCrumb */}
        <div className="flex flex-row items-center mt-2 mb-6 ml-2">
          <HomeIcon color="#738136" className="inline-block mr-4" />
          {breadcrumbParts.map((part, index) => (
            <span key={index}>
              <span
                className={` ${
                  index === breadcrumbParts.length - 1 ? "text-[#3e6807]" : "text-[#738136]"
                }`}
              >
                {part}
              </span>
              {index < breadcrumbParts.length - 1 && <span className="text-[#738136] mx-3">/</span>}
            </span>
          ))}
        </div>

        {/* Product Image & Price ..*/}
        <div className="mx-2 mb-8 grid grid-cols-1 md:grid-cols-2">
          {/* Image */}
          <div>
            <div className="md:ml-auto w-3/4">
              <img src={productDetail.img} className=""></img>
            </div>
          </div>
          {/* Description */}
          <div className="md:pl-6">
            {/* Name & Price */}
            <h1 className="text-2xl font-medium">{productDetail.name}</h1>
            <div className="text-2xl font-medium mt-1 mb-3">
              {productDetail.price.toLocaleString("de-DE")}đ
            </div>
            {/* button: add to cart */}
            <div className="w-64 h-12 p-2 bg-orange-400 hover:bg-orange-500 rounded-full flex items-center ">
              <div className="bg-white rounded-full px-2 py-0.5 mr-4">
                <button className="cursor-pointer" onClick={handleDecreaseQuantity}>
                  -
                </button>
                <input
                  className="w-6 text-center outline-none hide-arrow"
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    setQuantity(Number.parseInt(e.target.value));
                  }}
                />
                <button className="cursor-pointer" onClick={handleIncreaseQuantity}>
                  +
                </button>
              </div>
              <button onClick={handleAddToCart} className="text-white font-medium cursor-pointer">
                Thêm vào giỏ hàng
              </button>
            </div>

            {/* overview */}
            <div className="grid grid-cols-2 gap-3 my-4 py-4 border-t-[1px] border-b-[1px] border-gray-200">
              {productDetail.overview?.map((item: any, index: number) => (
                <div key={index} className="text-sm ">
                  🌿 {item}
                </div>
              ))}
            </div>
            {/* ship info */}
            <div className="grid grid-cols-2 gap-3 my-4 py-4">
              <div className="bg-gray-100 rounded-md p-3 text-sm">
                <div className="">Phí ship</div>
                <ul>
                  <li className="list-item">• Nội thành Hà Nội - 20.000đ</li>
                  <li className="list-item">• Các tỉnh khác - 25.000đ</li>
                </ul>
              </div>
              <div className="bg-gray-100 rounded-md p-3 text-sm">
                <div className="">Thời gian ship dự kiến</div>
                <ul>
                  <li className="list-item">• Hà Nội: 1-2 ngày</li>
                  <li className="list-item">• Các tỉnh khác: 2-4 ngày</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Product Detail */}
        <div className="mx-2">
          <h1 className="font-semibold text-2xl">THÔNG TIN SẢN PHẨM</h1>
          <div className="px-[16%]">
            {/* Introduction */}
            <p className="mb-4 mt-4">
              <em>
                <span>
                  <strong className="text-[#808000]">{productDetail.intro.firstPart}</strong>
                  {productDetail.intro.secondPart}
                </span>
              </em>
            </p>
            {/* Specification (Table) */}
            {productDetail.category === "single" && (
              <h2 className="mb-2 text-2xl font-semibold">Thông số sản phẩm</h2>
            )}
            {productDetail.category === "single" && (
              <div>
                <table className="w-full mb-4 border border-gray-300 border-collapse text-justify">
                  <thead className="">
                    <tr className="bg-[#738136]">
                      <th className="px-4 py-2  text-white w-2/5 border border-gray-300">
                        Thông số
                      </th>
                      <th className="px-4 py-2  text-white border border-gray-300">Nội dung</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(productDetail.specification).map(([key, value], index) => (
                      <tr key={key} className={index % 2 !== 0 ? "bg-gray-100" : ""}>
                        <td className="px-4 py-2 border border-gray-300">{key}</td>
                        <td className="px-4 py-2 border border-gray-300">{value as string}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Guide */}
            <h2 className="mt-4 text-2xl font-semibold">Hướng dẫn sử dụng</h2>
            <div className="mb-4">
              <ul>
                {productDetail.guide.map((step: any, index: number) => (
                  <li key={index} className="">
                    {step}
                  </li>
                ))}
              </ul>
            </div>

            {/* Note */}
            <h2 className="text-2xl font-semibold">Lưu ý khi sử dụng</h2>
            <div className="mb-4">
              <ul>
                {productDetail.note.map((item: any, index: number) => (
                  <li key={index} className="">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
