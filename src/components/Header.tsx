"use client";

import { BanIcon, PhoneIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getCartItemCount } from "@/services/CartService";
import { useRouter, usePathname } from "next/navigation";

const navItem = [
  { label: "Sản phẩm", href: "/san-pham", sectionId: "san-pham" },
  { label: "Giới thiệu", href: "/gioi-thieu", sectionId: "gioi-thieu" },
  // { label: "Hỗ trợ", href: "/ho-tro" },
];

export default function Header() {
  const [showChatIcons, setShowChatIcons] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

  const toggleShowChatIcons = () => {
    setShowChatIcons(!showChatIcons);
  };

  // Cập nhật số lượng giỏ hàng khi component mount và khi có thay đổi
  useEffect(() => {
    const updateCartCount = () => {
      setCartItemCount(getCartItemCount());
    };

    // Cập nhật lần đầu
    updateCartCount();

    // Lắng nghe sự kiện thay đổi giỏ hàng
    window.addEventListener("cartUpdated", updateCartCount);

    // Cleanup event listener
    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  // Hàm xử lý click navigation
  const handleNavClick = (e: React.MouseEvent, item: any) => {
    // Nếu đang ở trang chủ và có sectionId, scroll đến section
    if (pathname === "/" && item.sectionId) {
      e.preventDefault();
      const element = document.getElementById(item.sectionId);
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
    // Nếu không ở trang chủ, navigate đến trang tương ứng
    else if (pathname !== "/" && item.sectionId) {
      e.preventDefault();
      router.push(`/#${item.sectionId}`);
    }
    // Các link khác (như /san-pham) sẽ hoạt động bình thường
  };

  return (
    <header>
      <div className="bg-[url(/img/header_bg.webp)] py-3 ">
        <div className="max-w-7xl mx-auto">
          <div className="mx-6 flex items-center justify-between">
            {/* Logo */}
            <div className="mr-2 sm:mr-8 lg:mr-16">
              <Link href="/" className="inline-block">
                <img
                  src="/img/logo.png"
                  alt="logo"
                  className="w-18 h-16 sm:w-25 sm:h-22 "
                />
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
                      onClick={(e) => handleNavClick(e, item)}
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
            <div className="mr-2 relative">
              <a href="/gio-hang">
                <button className="cursor-pointer w-6 h-6">
                  <img src="/icon/cart.svg" alt="cart" />
                </button>
              </a>
              {/* Badge hiển thị số lượng sản phẩm */}
              {cartItemCount > 0 && (
                <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {cartItemCount > 99 ? "99+" : cartItemCount}
                </div>
              )}
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
              <a
                href="https://www.facebook.com/profile.php?id=61576923603831"
                target="_blank"
              >
                <button className="mb-2 bg-blue-500 text-white p-2 rounded-full shadow hover:scale-105 transition-transform">
                  <img src="/icon/messenger.svg" className="h-8 w-8" />
                </button>
              </a>
              <a href="tel:0392942596" target="_blank">
                <button className="mb-2 bg-green-600 text-white p-2 rounded-full shadow hover:scale-105 transition-transform">
                  <PhoneIcon className="h-8 w-8" />
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
