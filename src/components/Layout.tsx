"use client";

import Footer from "./Footer";
import Header from "./Header";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      {/* <main className="flex-grow bg-white max-w-7xl mx-auto px-4">{children}</main> */}
      <main className="flex-grow bg-white ">{children}</main>
      <Footer />
    </div>
  );
}
