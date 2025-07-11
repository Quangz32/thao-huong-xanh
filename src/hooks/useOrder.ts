import { useState } from 'react';

export interface OrderFormData {
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
  note: string;
  paymentMethod: string;
}

export interface UseOrderReturn {
  isSubmitting: boolean;
  submitOrder: (formData: OrderFormData, cartItems: any[]) => Promise<{ success: boolean; orderId?: string; error?: string }>;
}

export function useOrder(): UseOrderReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitOrder = async (formData: OrderFormData, cartItems: any[]) => {
    setIsSubmitting(true);
    
    try {
      // Chuẩn bị dữ liệu gửi lên server
      const orderData = {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        address: formData.address,
        note: formData.note,
        paymentMethod: formData.paymentMethod,
        isPaid: false,  //Mặc định cho đơn hàng
        cartItems: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          isCombo: item.isCombo,
          productIds: item.productIds,
          productName: item.productName,
          price: item.price
        }))
      };

      // Gọi API
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Có lỗi xảy ra khi đặt hàng');
      }

      return {
        success: true,
        orderId: result.orderId
      };

    } catch (error) {
      console.error('Lỗi khi đặt hàng:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Có lỗi xảy ra khi đặt hàng'
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    submitOrder
  };
} 