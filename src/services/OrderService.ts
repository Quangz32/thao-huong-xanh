import { database } from '@/lib/firebase';
import { ref, push, serverTimestamp, get, set, remove } from 'firebase/database';

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
    isCombo?: boolean;
    productIds?: string[];
  }>;
  totalAmount: number;
  createdAt?: any; // Firebase serverTimestamp - optional for new orders
  code?: string; // Mã đơn hàng được generate từ timestamp
}

export interface OrderWithTimestamp extends OrderData {
  orderId: string;
  createdAt: any; // Firebase serverTimestamp - required for saved orders
  code: string; // Mã đơn hàng - required for saved orders
  status: 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';
}

/**
 * Tạo mã đơn hàng từ timestamp
 * @returns Mã đơn hàng dạng chuỗi ký tự in hoa
 */
export function generateOrderCode(): string {
  const timestamp = Date.now();
  // Chuyển timestamp thành base36 (sử dụng 0-9, a-z) rồi uppercase
  return timestamp.toString(36).toUpperCase();
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
    
    // Tạo mã đơn hàng
    const orderCode = generateOrderCode();
    
    // Tạo đối tượng đơn hàng với timestamp
    const orderWithTimestamp: Omit<OrderWithTimestamp, 'orderId'> = {
      ...orderData,
      createdAt: serverTimestamp(),
      code: orderCode,
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

    console.log("orders", orders);

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
 * Xóa đơn hàng khỏi Firebase Realtime Database
 * @param orderId - ID đơn hàng cần xóa
 */
export async function deleteOrder(orderId: string): Promise<void> {
  try {
    const orderRef = ref(database, `orders/${orderId}`);
    await remove(orderRef);
    console.log(`Đơn hàng với ID ${orderId} đã được xóa.`);
  } catch (error) {
    console.error('Lỗi khi xóa đơn hàng:', error);
    throw new Error('Không thể xóa đơn hàng');
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

/**
 * Format thời gian tạo đơn hàng
 * @param timestamp - Firebase timestamp hoặc ISO string
 * @returns Chuỗi thời gian đã format
 */
export function formatOrderDate(timestamp: any): string {
  if (!timestamp) return "Chưa xác định";

  let date: Date;
  
  // Xử lý Firebase serverTimestamp
  if (timestamp.seconds) {
    date = new Date(timestamp.seconds * 1000);
  } 
  // Xử lý timestamp number
  else if (typeof timestamp === "number") {
    date = new Date(timestamp);
  } 
  // Xử lý ISO string
  else if (typeof timestamp === "string") {
    date = new Date(timestamp);
  } 
  // Fallback
  else {
    date = new Date(timestamp);
  }

  // Kiểm tra valid date
  if (isNaN(date.getTime())) {
    return "Thời gian không hợp lệ";
  }

  return date.toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Asia/Ho_Chi_Minh"
  });
} 