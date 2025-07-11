"use client";

import { useState } from "react";
import { getCart, clearCart } from "@/services/CartService";
import { getProductDetail } from "@/services/ProductService";
import { formatOrderDate } from "@/services/OrderService";
import { useOrder, OrderFormData } from "@/hooks/useOrder";
import { Flex, Radio, RadioChangeEvent } from "antd";
import { BoxIcon, PackageCheckIcon, QrCodeIcon, ShipIcon } from "lucide-react";

interface DeliveryInformationProps {
  onOrderSuccess?: () => void;
}

export default function DeliveryInformation({
  onOrderSuccess,
}: DeliveryInformationProps) {
  const { isSubmitting, submitOrder } = useOrder();
  const [formData, setFormData] = useState<OrderFormData>({
    fullName: "",
    phoneNumber: "",
    email: "",
    address: "",
    note: "",
    paymentMethod: "", // COD or QR
  });
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
    orderId?: string;
    code?: string;
    createdAt?: string;
  } | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onRadioChange = (e: RadioChangeEvent) => {
    setFormData((prev) => ({
      ...prev,
      paymentMethod: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Validate form
    if (
      !formData.fullName.trim() ||
      !formData.phoneNumber.trim() ||
      !formData.address.trim() ||
      !formData.paymentMethod.trim()
    ) {
      setMessage({
        type: "error",
        text: "Vui lòng điền đầy đủ thông tin bắt buộc",
      });
      return;
    }

    // Lấy giỏ hàng
    const cart = getCart();
    if (!cart || (Array.isArray(cart) && cart.length === 0)) {
      setMessage({
        type: "error",
        text: "Giỏ hàng trống, vui lòng thêm sản phẩm trước khi đặt hàng",
      });
      return;
    }

    // Chuẩn bị dữ liệu giỏ hàng với thông tin chi tiết sản phẩm
    const cartWithDetails = cart.map((item) => {
      const productDetail = getProductDetail(item.productId);
      return {
        productId: item.productId,
        isCombo: item.isCombo,
        productIds: item.productIds,
        quantity: item.quantity,
        productName: productDetail.name,
        price: productDetail.price,
      };
    });

    // Gửi đơn hàng
    const result = await submitOrder(formData, cartWithDetails);

    if (result.success) {
      setMessage({
        type: "success",
        text: `Đặt hàng thành công! Mã đơn hàng: ${result.code}`,
        orderId: result.orderId,
        code: result.code,
        createdAt: result.createdAt,
      });

      // Reset form
      setFormData({
        fullName: "",
        phoneNumber: "",
        email: "",
        address: "",
        note: "",
        paymentMethod: "",
      });

      // Xóa giỏ hàng
      clearCart();

      // Gọi callback để cập nhật UI giỏ hàng ngay lập tức
      if (onOrderSuccess) {
        onOrderSuccess();
      }
    } else {
      setMessage({
        type: "error",
        text: result.error || "Có lỗi xảy ra khi đặt hàng",
      });
    }
  };

  return (
    <div className="">
      <h2 className="font-medium text-xl">Thông tin nhận hàng</h2>

      {/* Hiển thị thông báo */}
      {message && (
        <div
          className={`mt-4 p-4 rounded-md ${
            message.type === "success"
              ? "bg-green-100 text-green-700 border border-green-300"
              : "bg-red-100 text-red-700 border border-red-300"
          }`}
        >
          <div className="font-medium">{message.text}</div>
          {message.type === "success" && message.code && message.createdAt && (
            <div className="mt-2 text-sm">
              <div>
                Thời gian đặt hàng: {formatOrderDate(message.createdAt)}
              </div>
              <div>
                Bạn có thể liên hệ với chúng tôi bằng mã đơn hàng:{" "}
                <span className="font-mono font-bold">{message.code}</span>
              </div>
            </div>
          )}
        </div>
      )}

      <form className="mt-4" onSubmit={handleSubmit}>
        {/* Name and Phone */}
        <div className="flex flex-row mb-4">
          <div className="flex-1 mr-2">
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              placeholder="Họ tên"
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="flex-1 ml-2">
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              placeholder="Số điện thoại"
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Email and Address */}
        <div className="mb-4">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            placeholder="Địa chỉ email (để nhận thông tin đơn hàng)"
            disabled={isSubmitting}
          />
        </div>

        <div className="mb-4">
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            placeholder="Địa chỉ (Ví dụ: 123 Hoàng Cầu)"
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="mb-4">
          <textarea
            name="note"
            value={formData.note}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            placeholder="Ghi chú thêm (Ví dụ: Giao giờ hành chính)"
            rows={3}
            disabled={isSubmitting}
          />
        </div>

        <div className="flex items-center mb-4">
          <span className="mr-4 ">Hãy chọn phương thức thanh toán</span>
          <Radio.Group
            buttonStyle="solid"
            onChange={onRadioChange}
            // value={value}
            options={[
              {
                value: "COD",
                label: (
                  <Flex gap="small" justify="center" align="center" vertical>
                    <PackageCheckIcon style={{ fontSize: 18 }} />
                    Thanh toán khi nhận hàng
                  </Flex>
                ),
              },
              {
                value: "QR",
                label: (
                  <Flex gap="small" justify="center" align="center" vertical>
                    <QrCodeIcon style={{ fontSize: 18 }} />
                    Thanh toán QR
                  </Flex>
                ),
              },
            ]}
          />
        </div>
        {formData.paymentMethod === "QR" && (
          <div className=" mx-auto border border-black w-64 64">
            <img src="/img/qr-pay.jpg" alt="QR Code" className=" " />
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`mt-4 w-full font-medium py-2 rounded-md transition-colors ${
            isSubmitting
              ? "bg-gray-400 text-gray-600 cursor-not-allowed"
              : "bg-orange-500 text-white hover:bg-green-700"
          }`}
        >
          {isSubmitting ? "Đang xử lý..." : "Xác nhận thông tin"}
        </button>
      </form>
    </div>
  );
}
