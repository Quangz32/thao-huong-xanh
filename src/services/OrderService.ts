import { database } from '@/lib/firebase';
import { ref, push, serverTimestamp } from 'firebase/database';

export interface OrderData {
  fullName: string;
  phoneNumber: string;
  email?: string;
  address: string;
  note?: string;
  paymentMethod: string;
  isPaid: boolean;
  cartItems: Array<{
    productId: string;
    quantity: number;
    productName: string;
    price: number;
  }>;
  totalAmount: number;
}

export interface OrderWithTimestamp extends OrderData {
  orderId: string;
  createdAt: any; // Firebase serverTimestamp
  status: 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';
}

/**
 * Lưu đơn hàng vào Firebase Realtime Database
 * @param orderData - Thông tin đơn hàng
 * @returns Promise với ID đơn hàng mới được tạo
 */
export async function saveOrder(orderData: OrderData): Promise<string> {
  try {
    // Validate dữ liệu đầu vào
    if (!orderData.fullName || !orderData.phoneNumber || !orderData.address) {
      throw new Error('Thông tin bắt buộc không được để trống');
    }

    if (!orderData.cartItems || orderData.cartItems.length === 0) {
      throw new Error('Giỏ hàng không được để trống');
    }

    // Tạo reference tới node 'orders' trong database
    const ordersRef = ref(database, 'orders');
    
    // Tạo đối tượng đơn hàng với timestamp
    const orderWithTimestamp: Omit<OrderWithTimestamp, 'orderId'> = {
      ...orderData,
      createdAt: serverTimestamp(),
      status: 'pending'
    };

    // Lưu vào Firebase và nhận key
    const newOrderRef = await push(ordersRef, orderWithTimestamp);
    
    if (!newOrderRef.key) {
      throw new Error('Không thể tạo đơn hàng');
    }

    return newOrderRef.key;
  } catch (error) {
    console.error('Lỗi khi lưu đơn hàng:', error);
    throw error;
  }
}

/**
 * Tính tổng tiền của giỏ hàng
 * @param cartItems - Danh sách sản phẩm trong giỏ
 * @returns Tổng tiền
 */
export function calculateTotalAmount(cartItems: OrderData['cartItems']): number {
  return cartItems.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
} 