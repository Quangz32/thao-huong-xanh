import { database } from '@/lib/firebase';
import { ref, push, serverTimestamp, get, set } from 'firebase/database';

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
 * Lấy tất cả đơn hàng từ Firebase Realtime Database
 * @returns Promise với danh sách đơn hàng
 */
export async function getAllOrders(): Promise<OrderWithTimestamp[]> {
  try {
    const ordersRef = ref(database, 'orders');
    
    const snapshot = await get(ordersRef);
    
    if (!snapshot.exists()) {
      return [];
    }

    const ordersData = snapshot.val();
    const orders: OrderWithTimestamp[] = [];

    // Chuyển đổi object thành array và thêm orderId
    Object.keys(ordersData).forEach(orderId => {
      orders.push({
        orderId,
        ...ordersData[orderId]
      });
    });

    // Sắp xếp theo thời gian tạo mới nhất (client-side sorting)
    return orders.sort((a, b) => {
      const timeA = a.createdAt || 0;
      const timeB = b.createdAt || 0;
      return timeB - timeA; // Sắp xếp giảm dần (mới nhất trước)
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đơn hàng:', error);
    throw new Error('Không thể lấy danh sách đơn hàng');
  }
}

/**
 * Cập nhật trạng thái đơn hàng
 * @param orderId - ID đơn hàng
 * @param status - Trạng thái mới
 */
export async function updateOrderStatus(
  orderId: string, 
  status: 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled'
): Promise<void> {
  try {
    const orderRef = ref(database, `orders/${orderId}/status`);
    await set(orderRef, status);
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
    throw new Error('Không thể cập nhật trạng thái đơn hàng');
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