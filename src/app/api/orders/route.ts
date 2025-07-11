import { NextRequest, NextResponse } from 'next/server';
import { saveOrder, OrderData, calculateTotalAmount, updateOrderStatus, deleteOrder, generateOrderCode } from '@/services/OrderService';

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

    // Tạo mã đơn hàng
    const orderCode = generateOrderCode();

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
      totalAmount,
      code: orderCode
    };

    // Lưu đơn hàng vào Firebase
    const orderId = await saveOrder(orderData);

    // Trả về kết quả thành công
    return NextResponse.json({
      success: true,
      orderId,
      code: orderCode,
      createdAt: new Date().toISOString(),
      message: 'Đơn hàng đã được tạo thành công'
    }, { status: 201 });

  } catch (error) {
    console.error('Lỗi API tạo đơn hàng:', error);
    
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Có lỗi xảy ra khi tạo đơn hàng'
    }, { status: 500 });
  }
}

// PUT method để cập nhật trạng thái đơn hàng
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, status } = body;

    // Validate dữ liệu đầu vào
    if (!orderId || !status) {
      return NextResponse.json(
        { error: 'Thiếu thông tin orderId hoặc status' },
        { status: 400 }
      );
    }

    // Validate status values
    const validStatuses = ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Trạng thái không hợp lệ' },
        { status: 400 }
      );
    }

    // Cập nhật trạng thái
    await updateOrderStatus(orderId, status);

    return NextResponse.json({
      success: true,
      message: 'Cập nhật trạng thái đơn hàng thành công'
    });

  } catch (error) {
    console.error('Lỗi API cập nhật trạng thái đơn hàng:', error);
    
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Có lỗi xảy ra khi cập nhật trạng thái đơn hàng'
    }, { status: 500 });
  }
}

// DELETE method để xóa đơn hàng
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    // Validate dữ liệu đầu vào
    if (!orderId) {
      return NextResponse.json(
        { error: 'Thiếu thông tin orderId' },
        { status: 400 }
      );
    }

    // Xóa đơn hàng
    await deleteOrder(orderId);

    return NextResponse.json({
      success: true,
      message: 'Xóa đơn hàng thành công'
    });

  } catch (error) {
    console.error('Lỗi API xóa đơn hàng:', error);
    
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Có lỗi xảy ra khi xóa đơn hàng'
    }, { status: 500 });
  }
} 