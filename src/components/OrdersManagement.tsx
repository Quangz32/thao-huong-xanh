"use client";

import { useState, useEffect } from "react";
import { getAllOrders, OrderWithTimestamp } from "@/services/OrderService";
import { useAuth } from "@/hooks/useAuth";
import {
  Table,
  Button,
  Tag,
  Space,
  Card,
  Typography,
  Drawer,
  Descriptions,
  List,
  message,
  Layout,
  Avatar,
  Statistic,
} from "antd";
import {
  LogoutOutlined,
  ReloadOutlined,
  EyeOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const statusConfig = {
  pending: { color: "orange", text: "Chờ xử lý" },
  confirmed: { color: "blue", text: "Đã xác nhận" },
  shipping: { color: "purple", text: "Đang giao" },
  delivered: { color: "green", text: "Đã giao" },
  cancelled: { color: "red", text: "Đã hủy" },
};

export default function OrdersManagement() {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState<OrderWithTimestamp[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithTimestamp | null>(
    null
  );
  const [drawerVisible, setDrawerVisible] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const ordersData = await getAllOrders();
      setOrders(ordersData);
      message.success("Tải danh sách đơn hàng thành công");
    } catch (error: any) {
      message.error(error.message || "Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      message.success("Đăng xuất thành công");
    } catch (error) {
      message.error("Lỗi khi đăng xuất");
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";

    let date: Date;
    if (timestamp.seconds) {
      date = new Date(timestamp.seconds * 1000);
    } else if (typeof timestamp === "number") {
      date = new Date(timestamp);
    } else {
      date = new Date(timestamp);
    }

    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const showOrderDetail = (order: OrderWithTimestamp) => {
    setSelectedOrder(order);
    setDrawerVisible(true);
  };

  const columns: ColumnsType<OrderWithTimestamp> = [
    {
      title: "Mã đơn hàng",
      dataIndex: "orderId",
      key: "orderId",
      width: 120,
      render: (orderId: string) => <Text code>#{orderId.slice(-8)}</Text>,
    },
    {
      title: "Khách hàng",
      key: "customer",
      width: 200,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{record.fullName}</Text>
          <Text type="secondary">{record.phoneNumber}</Text>
        </Space>
      ),
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      width: 250,
      ellipsis: true,
    },
    {
      title: "Sản phẩm",
      key: "items",
      width: 120,
      render: (_, record) => (
        <Space>
          <ShoppingCartOutlined />
          <Text>{record.cartItems.length} SP</Text>
        </Space>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: 140,
      render: (amount: number) => (
        <Text strong style={{ color: "#52c41a" }}>
          {formatCurrency(amount)}
        </Text>
      ),
    },
    {
      title: "Thanh toán",
      key: "payment",
      width: 120,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Tag color={record.paymentMethod === "COD" ? "orange" : "blue"}>
            {record.paymentMethod === "COD" ? "COD" : "Chuyển khoản"}
          </Tag>
          {record.isPaid && <Tag color="green">Đã thanh toán</Tag>}
        </Space>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: keyof typeof statusConfig) => (
        <Tag color={statusConfig[status]?.color}>
          {statusConfig[status]?.text}
        </Tag>
      ),
    },
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 160,
      render: (timestamp: any) => <Text>{formatDate(timestamp)}</Text>,
    },
    {
      title: "Hành động",
      key: "action",
      width: 100,
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          size="small"
          onClick={() => showOrderDetail(record)}
        >
          Xem
        </Button>
      ),
    },
  ];

  // Tính toán thống kê
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce(
    (sum, order) => sum + order.totalAmount,
    0
  );
  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  ).length;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <header className="!bg-[#3e6807]">
        <div className="flex justify-between items-center py-4 px-16">
          <div>
            <div className="text-3xl font-semibold text-white">
              Quản lí đơn hàng - Thảo Hương Xanh
            </div>
            <div className="text-gray-200">Xin chào, {user?.email}</div>
          </div>
          <div className="text-white">
            <Button
              type="primary"
              danger
              icon={<LogoutOutlined />}
              onClick={handleLogout}
            >
              Đăng xuất
            </Button>
          </div>
        </div>
      </header>

      <Content style={{ padding: "24px" }}>
        {/* Thống kê */}
        <div style={{ marginBottom: 24 }}>
          <Space size="large">
            <Card>
              <Statistic
                title="Tổng đơn hàng"
                value={totalOrders}
                prefix={<ShoppingCartOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
            <Card>
              <Statistic
                title="Chờ xử lý"
                value={pendingOrders}
                prefix={<UserOutlined />}
                valueStyle={{ color: "#faad14" }}
              />
            </Card>
            <Card>
              <Statistic
                title="Tổng doanh thu"
                value={totalRevenue}
                prefix={<DollarOutlined />}
                formatter={(value) => formatCurrency(Number(value))}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Space>
        </div>

        {/* Bảng đơn hàng */}
        <Card
          title={
            <Space>
              <ShoppingCartOutlined />
              <span>Danh sách đơn hàng</span>
            </Space>
          }
          extra={
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={loadOrders}
              loading={loading}
            >
              Làm mới
            </Button>
          }
        >
          <Table
            columns={columns}
            dataSource={orders}
            rowKey="orderId"
            loading={loading}
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} của ${total} đơn hàng`,
              pageSizeOptions: ["10", "20", "50", "100"],
              defaultPageSize: 20,
            }}
            scroll={{ x: 1200 }}
            size="middle"
          />
        </Card>

        {/* Drawer chi tiết đơn hàng */}
        <Drawer
          title={
            <Space>
              <EyeOutlined />
              <span>Chi tiết đơn hàng #{selectedOrder?.orderId.slice(-8)}</span>
            </Space>
          }
          width={700}
          open={drawerVisible}
          onClose={() => setDrawerVisible(false)}
          destroyOnClose
        >
          {selectedOrder && (
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              {/* Thông tin khách hàng */}
              <Card title="Thông tin khách hàng" size="small">
                <Descriptions column={1}>
                  <Descriptions.Item label="Họ tên">
                    <Text strong>{selectedOrder.fullName}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Số điện thoại">
                    {selectedOrder.phoneNumber}
                  </Descriptions.Item>
                  {selectedOrder.email && (
                    <Descriptions.Item label="Email">
                      {selectedOrder.email}
                    </Descriptions.Item>
                  )}
                  <Descriptions.Item label="Địa chỉ">
                    {selectedOrder.address}
                  </Descriptions.Item>
                  {selectedOrder.note && (
                    <Descriptions.Item label="Ghi chú">
                      {selectedOrder.note}
                    </Descriptions.Item>
                  )}
                </Descriptions>
              </Card>

              {/* Sản phẩm */}
              <Card title="Sản phẩm đặt hàng" size="small">
                <List
                  dataSource={selectedOrder.cartItems}
                  renderItem={(item, index) => (
                    <List.Item key={index}>
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            icon={<ShoppingCartOutlined />}
                            style={{ backgroundColor: "#52c41a" }}
                          />
                        }
                        title={<Text strong>{item.productName}</Text>}
                        description={`Số lượng: ${
                          item.quantity
                        } | Đơn giá: ${formatCurrency(item.price)}`}
                      />
                      <Text strong style={{ color: "#52c41a" }}>
                        {formatCurrency(item.price * item.quantity)}
                      </Text>
                    </List.Item>
                  )}
                />
              </Card>

              {/* Tổng kết */}
              <Card size="small">
                <Descriptions column={2}>
                  <Descriptions.Item label="Trạng thái" span={2}>
                    <Tag
                      color={statusConfig[selectedOrder.status]?.color}
                      style={{ fontSize: "14px" }}
                    >
                      {statusConfig[selectedOrder.status]?.text}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Thanh toán">
                    <Space direction="vertical" size={0}>
                      <Tag
                        color={
                          selectedOrder.paymentMethod === "COD"
                            ? "orange"
                            : "blue"
                        }
                      >
                        {selectedOrder.paymentMethod === "COD"
                          ? "COD"
                          : "Chuyển khoản"}
                      </Tag>
                      {selectedOrder.isPaid && (
                        <Tag color="green">Đã thanh toán</Tag>
                      )}
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="Thời gian đặt">
                    {formatDate(selectedOrder.createdAt)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Tổng cộng" span={2}>
                    <Text strong style={{ fontSize: "18px", color: "#52c41a" }}>
                      {formatCurrency(selectedOrder.totalAmount)}
                    </Text>
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Space>
          )}
        </Drawer>
      </Content>
    </Layout>
  );
}
