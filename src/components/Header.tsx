"use client";

import Image from "next/image";
import Link from "next/link";

const navItem = [
  { label: "Sản phẩm", href: "/san-pham" },
  { label: "Giới thiệu", href: "/gioi-thieu" },
  { label: "Hỗ trợ", href: "/ho-tro" },
];
export default function Header() {
  return (
    <header>
      <div className="bg-[url(/img/header_bg.webp)] py-3 ">
        <div className="max-w-7xl mx-auto">
          <div className="mx-6 flex items-center justify-between">
            {/* Logo */}
            <div className="lg:mr-24 md:mr-16 sm:mr-8">
              <Link href="/" className="inline-block">
                <Image src="/img/logo.png" alt="logo" width={100} height={100}></Image>
              </Link>
            </div>
            {/* tabs */}
            <div className="mr-6">
              <ul className="flex">
                {navItem.map((item, index) => (
                  <li key={item.href} className="mr-2">
                    <Link
                      href={item.href}
                      className={`text-white font-medium pr-2 hover:text-orange-400 ${
                        index < navItem.length - 1 ? "border-r-2" : ""
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {/* Search */}
            <div className="lg:mr-24 md:mr-16 sm:mr-8 rounded-full bg-white h-[40px] flex-[1]">
              <form className="mx-5 h-full">
                <div className="flex items-center h-full">
                  <input
                    type="text"
                    name="search_string"
                    placeholder="Tên sản phẩm, danh mục ..."
                    className="h-[24px] w-full bg-yellow outline-none"
                  ></input>
                  <button className="w-6 h-6">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                      <path
                        fill="silver"
                        d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"
                      />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
            {/* Cart */}
            <div className="">
              <button className="cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="w-6 h-6">
                  <path
                    fill="white"
                    d="M0 24C0 10.7 10.7 0 24 0L69.5 0c22 0 41.5 12.8 50.6 32l411 0c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3l-288.5 0 5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5L488 336c13.3 0 24 10.7 24 24s-10.7 24-24 24l-288.3 0c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5L24 48C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      This is header
    </header>
  );
}
