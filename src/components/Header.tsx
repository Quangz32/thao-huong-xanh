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
            <div className="mr-2 sm:mr-8 lg:mr-16">
              <Link href="/" className="inline-block">
                <img src="/img/logo.png" alt="logo" className="w-16 h-16 sm:w-22 sm:h-22 " />
                {/* <Image src="/img/logo.png" alt="logo" width={88} height={88}></Image> */}
              </Link>
            </div>
            {/* tabs : desktop */}
            <div className="mr-6  hidden sm:block">
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
            <div className="mr-2 sm:mr-8 lg:mr-16 rounded-full bg-white h-[40px] flex-[1]">
              <form className="mx-5 h-full">
                <div className="flex items-center h-full">
                  <input
                    type="text"
                    name="search_string"
                    placeholder="Tên sản phẩm, danh mục ..."
                    className="h-[24px] w-full bg-yellow outline-none"
                  ></input>
                  <button className="ml-2 w-6 h-6">
                    <img src="/icon/search.svg" alt="search" />
                    {/* <img src="/icon/cart.svg" alt="cart" /> */}
                  </button>
                </div>
              </form>
            </div>
            {/* Cart */}
            <div className="mr-2">
              <button className="cursor-pointer w-6 h-6">
                <img src="/icon/cart.svg" alt="cart" />
              </button>
            </div>
            {/** navigation: mobile */}
            <div className="sm:hidden">
              <button className="cursor-pointer w-6 h-6">
                <img src="/icon/bar-3.svg" alt="navigation" />
              </button>
            </div>
          </div>
        </div>
      </div>
      This is header
    </header>
  );
}
