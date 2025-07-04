"use client";

export default function Footer() {
  return (
    <footer>
      <div className="bg-[#3e6807]  ">
        <div className="max-w-7xl mx-auto ">
          <div className="flex justify-between">
            <div className="mt-4">
              <h1 className="text-white text-4xl mb-2">Thảo Hương Xanh</h1>
              <div className="text-white text-xl mb-2">
                Địa chỉ: Xã Thạch Hoà, Thạch Thất, Hà Nội
              </div>
              <div className="text-white text-xl mb-2">Thông tin liên hệ: 0392.942.596</div>
              <div className="flex">
                <img src="/img/qr-fanpage.png" className="w-24 h-24 mb-2"></img>
                <span className="ml-4 text-xl text-white pt-16">Fanpage</span>
              </div>
            </div>
            <div>
              <div className="mt-4 text-white text-4xl mb-2">NSX: Mịn Màng Việt Nam</div>
              <div className="text-white text-xl mb-2">Địa chỉ: Quận 9, TP Hồ Chí Minh</div>
            </div>
          </div>
          {/* <div className="text-2xl text-white">Footer ne</div> */}
        </div>
      </div>
    </footer>
  );
}
