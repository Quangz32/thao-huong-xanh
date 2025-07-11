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
  isUpdating: boolean;
  isDeleting: boolean;
  submitOrder: (formData: OrderFormData, cartItems: any[]) => Promise<{ 
    success: boolean; 
    orderId?: string; 
    code?: string;
    error?: string;
    createdAt?: string;
  }>;
  updateOrderStatus: (orderId: string, status: string) => Promise<{ success: boolean; error?: string }>;
  deleteOrder: (orderId: string) => Promise<{ success: boolean; error?: string }>;
}

export function useOrder(): UseOrderReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
        })),
        createdAt: new Date().toISOString() // Thêm timestamp phía client
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
        orderId: result.orderId,
        code: result.code,
        createdAt: new Date().toISOString()
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

  const updateOrderStatus = async (orderId: string, status: string) => {
    setIsUpdating(true);
    
    try {
      const response = await fetch('/api/orders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, status })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Có lỗi xảy ra khi cập nhật trạng thái');
      }

      return { success: true };

    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Có lỗi xảy ra khi cập nhật trạng thái'
      };
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteOrder = async (orderId: string) => {
    setIsDeleting(true);
    
    try {
      const response = await fetch(`/api/orders?orderId=${orderId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Có lỗi xảy ra khi xóa đơn hàng');
      }

      return { success: true };

    } catch (error) {
      console.error('Lỗi khi xóa đơn hàng:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Có lỗi xảy ra khi xóa đơn hàng'
      };
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isSubmitting,
    isUpdating,
    isDeleting,
    submitOrder,
    updateOrderStatus,
    deleteOrder
  };
} 