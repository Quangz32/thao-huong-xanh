import { NextRequest, NextResponse } from 'next/server';
import { saveOrder, OrderData, calculateTotalAmount } from '@/services/OrderService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate dữ liệu đầu vào
    const { fullName, phoneNumber, email, address, note, cartItems, paymentMethod } = body;
    
    if (!fullName || !phoneNumber || !address) {
      return NextResponse.json(
        { error: 'Vui lòng điền đầy đủ thông tin bắt buộc' },
        { status: 400 }
      );
    }

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Giỏ hàng không được để trống' },
        { status: 400 }
      );
    }

    // Validate từng item trong giỏ hàng
    for (const item of cartItems) {
      if (!item.productId || !item.quantity || !item.productName || !item.price) {
        return NextResponse.json(
          { error: 'Thông tin sản phẩm không hợp lệ' },
          { status: 400 }
        );
      }
      
      if (item.quantity <= 0 || item.price <= 0) {
        return NextResponse.json(
          { error: 'Số lượng và giá sản phẩm phải lớn hơn 0' },
          { status: 400 }
        );
      }
    }

    // Tính tổng tiền
    const totalAmount = calculateTotalAmount(cartItems);

    // Tạo đối tượng đơn hàng
    const orderData: OrderData = {
      fullName: fullName.trim(),
      phoneNumber: phoneNumber.trim(),
      email: email?.trim() || '',
      address: address.trim(),
      note: note?.trim() || '',
      paymentMethod: paymentMethod.trim(),
      isPaid: false,
      cartItems,
      totalAmount
    };

    // Lưu đơn hàng vào Firebase
    const orderId = await saveOrder(orderData);

    // Trả về kết quả thành công
    return NextResponse.json({
      success: true,
      orderId,
      message: 'Đơn hàng đã được tạo thành công'
    }, { status: 201 });

  } catch (error) {
    console.error('Lỗi API tạo đơn hàng:', error);
    
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Có lỗi xảy ra khi tạo đơn hàng'
    }, { status: 500 });
  }
} 