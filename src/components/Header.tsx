"use client";

import { BanIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const navItem = [
  { label: "Sản phẩm", href: "/san-pham" },
  { label: "Giới thiệu", href: "/gioi-thieu" },
  // { label: "Hỗ trợ", href: "/ho-tro" },
];
export default function Header() {
  const [showChatIcons, setShowChatIcons] = useState(false);

  const toggleShowChatIcons = () => {
    setShowChatIcons(!showChatIcons);
  };

  return (
    <header>
      <div className="bg-[url(/img/header_bg.webp)] py-3 ">
        <div className="max-w-7xl mx-auto">
          <div className="mx-6 flex items-center justify-between">
            {/* Logo */}
            <div className="mr-2 sm:mr-8 lg:mr-16">
              <Link href="/" className="inline-block">
                <img src="/img/logo.png" alt="logo" className="w-18 h-16 sm:w-25 sm:h-22 " />
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
                      className={` pr-2 text-white ${
                        index < navItem.length - 1 ? "border-r-2" : ""
                      }`}
                    >
                      <span className="text-white font-medium hover:text-orange-400 ">
                        {item.label}
                      </span>
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
                <BanIcon className="w-full h-full" color="silver" />
                {/* <img src="/icon/comments-solid.svg" className="h-6 w-6"></img> */}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
