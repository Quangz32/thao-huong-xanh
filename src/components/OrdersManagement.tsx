"use client";

import { useState, useEffect } from "react";
import {
  getAllOrders,
  OrderWithTimestamp,
  formatOrderDate,
} from "@/services/OrderService";
import { useAuth } from "@/hooks/useAuth";
import { useOrder } from "@/hooks/useOrder";
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
  Dropdown,
  Modal,
  Select,
} from "antd";
import {
  LogoutOutlined,
  ReloadOutlined,
  EyeOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  DollarOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { getProductDetail } from "@/services/ProductService";
import type { ColumnsType } from "antd/es/table";
import type { MenuProps } from "antd";

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
  const { updateOrderStatus, deleteOrder, isUpdating, isDeleting } = useOrder();
  const [orders, setOrders] = useState<OrderWithTimestamp[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithTimestamp | null>(
    null
  );
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [statusUpdateModal, setStatusUpdateModal] = useState<{
    visible: boolean;
    orderId: string;
    code: string;
    currentStatus: string;
  }>({
    visible: false,
    orderId: "",
    code: "",
    currentStatus: "",
  });

  // Helper function để tạo combo label
  const productNameMap = new Map<string, string>([
    ["xa-bong-kho-qua", "Khổ Qua"],
    ["xa-bong-nghe", "Nghệ"],
    ["xa-bong-vo-cam", "Cam"],
    ["xa-bong-tra-xanh", "Trà Xanh"],
    ["xa-bong-cam-thao", "Cam Thảo"],
  ]);

  const getComboLabel = (productIds: string[]) => {
    return productIds.map((id) => productNameMap.get(id)).join(", ");
  };

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

  const handleUpdateStatus = (
    orderId: string,
    code: string,
    currentStatus: string
  ) => {
    setStatusUpdateModal({
      visible: true,
      orderId,
      code,
      currentStatus,
    });
  };

  const handleConfirmStatusUpdate = async (newStatus: string) => {
    try {
      const result = await updateOrderStatus(
        statusUpdateModal.orderId,
        newStatus
      );

      if (result.success) {
        message.success("Cập nhật trạng thái đơn hàng thành công");
        loadOrders(); // Reload để cập nhật dữ liệu
        setStatusUpdateModal({
          visible: false,
          orderId: "",
          code: "",
          currentStatus: "",
        });
      } else {
        message.error(result.error || "Có lỗi xảy ra khi cập nhật trạng thái");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi cập nhật trạng thái");
    }
  };

  const handleDeleteOrder = (orderId: string, customerName: string) => {
    Modal.confirm({
      title: "Xác nhận xóa đơn hàng",
      content: `Bạn có chắc chắn muốn xóa đơn hàng của khách hàng "${customerName}"? Thao tác này không thể hoàn tác.`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          const result = await deleteOrder(orderId);

          if (result.success) {
            message.success("Xóa đơn hàng thành công");
            loadOrders(); // Reload để cập nhật dữ liệu
          } else {
            message.error(result.error || "Có lỗi xảy ra khi xóa đơn hàng");
          }
        } catch (error) {
          message.error("Có lỗi xảy ra khi xóa đơn hàng");
        }
      },
    });
  };

  const columns: ColumnsType<OrderWithTimestamp> = [
    {
      title: "Mã đơn hàng",
      dataIndex: "code",
      key: "code",
      width: 120,
      render: (code: string) => <Text code>{code || "N/A"}</Text>,
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
      render: (timestamp: any) => <Text>{formatOrderDate(timestamp)}</Text>,
    },
    {
      title: "Hành động",
      key: "action",
      width: 150,
      render: (_, record) => {
        const menuItems: MenuProps["items"] = [
          {
            key: "view",
            label: "Xem chi tiết",
            icon: <EyeOutlined />,
            onClick: () => showOrderDetail(record),
          },
          {
            key: "update",
            label: "Cập nhật trạng thái",
            icon: <EditOutlined />,
            onClick: () =>
              handleUpdateStatus(record.orderId, record.code, record.status),
          },
          {
            type: "divider",
          },
          {
            key: "delete",
            label: "Xóa đơn hàng",
            icon: <DeleteOutlined />,
            danger: true,
            onClick: () => handleDeleteOrder(record.orderId, record.fullName),
          },
        ];

        return (
          <Space>
            <Button
              type="primary"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => showOrderDetail(record)}
            >
              Xem
            </Button>
            <Dropdown
              menu={{ items: menuItems }}
              trigger={["click"]}
              placement="bottomRight"
            >
              <Button
                type="default"
                icon={<MoreOutlined />}
                size="small"
                loading={isUpdating || isDeleting}
              />
            </Dropdown>
          </Space>
        );
      },
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
              <span>Chi tiết đơn hàng {selectedOrder?.code || "N/A"}</span>
            </Space>
          }
          width={700}
          open={drawerVisible}
          onClose={() => setDrawerVisible(false)}
          destroyOnClose
          footer={
            selectedOrder && (
              <Space>
                <Button
                  icon={<EditOutlined />}
                  onClick={() =>
                    handleUpdateStatus(
                      selectedOrder.orderId,
                      selectedOrder.code,
                      selectedOrder.status
                    )
                  }
                  loading={isUpdating}
                >
                  Cập nhật trạng thái
                </Button>
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() =>
                    handleDeleteOrder(
                      selectedOrder.orderId,
                      selectedOrder.fullName
                    )
                  }
                  loading={isDeleting}
                >
                  Xóa đơn hàng
                </Button>
              </Space>
            )
          }
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
                  renderItem={(item, index) => {
                    const productDetail = getProductDetail(item.productId);
                    return (
                      <List.Item key={index}>
                        <List.Item.Meta
                          avatar={
                            <img
                              src={
                                productDetail?.img || "img/img_placeholder.jpeg"
                              }
                              alt={item.productName}
                              style={{
                                width: 64,
                                height: 64,
                                objectFit: "cover",
                                borderRadius: 8,
                                border: "1px solid #f0f0f0",
                              }}
                            />
                          }
                          title={
                            <div>
                              <Text strong>{item.productName}</Text>
                              {item.isCombo && item.productIds && (
                                <div>
                                  <Text
                                    type="secondary"
                                    style={{ fontSize: 12 }}
                                  >
                                    ({getComboLabel(item.productIds)})
                                  </Text>
                                </div>
                              )}
                            </div>
                          }
                          description={`Số lượng: ${
                            item.quantity
                          } | Đơn giá: ${formatCurrency(item.price)}`}
                        />
                        <Text strong style={{ color: "#52c41a" }}>
                          {formatCurrency(item.price * item.quantity)}
                        </Text>
                      </List.Item>
                    );
                  }}
                />
              </Card>

              {/* Tổng kết */}
              <Card size="small">
                <Descriptions column={2}>
                  <Descriptions.Item label="Trạng thái" span={2}>
                    <Space>
                      <Tag
                        color={statusConfig[selectedOrder.status]?.color}
                        style={{ fontSize: "14px" }}
                      >
                        {statusConfig[selectedOrder.status]?.text}
                      </Tag>
                      <Button
                        type="link"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() =>
                          handleUpdateStatus(
                            selectedOrder.orderId,
                            selectedOrder.code,
                            selectedOrder.status
                          )
                        }
                      >
                        Cập nhật
                      </Button>
                    </Space>
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
                    {formatOrderDate(selectedOrder.createdAt)}
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

        {/* Modal cập nhật trạng thái */}
        <Modal
          title="Cập nhật trạng thái đơn hàng"
          open={statusUpdateModal.visible}
          onCancel={() =>
            setStatusUpdateModal({
              visible: false,
              orderId: "",
              code: "",
              currentStatus: "",
            })
          }
          footer={null}
          destroyOnClose
        >
          <div className="py-4">
            <p className="mb-4">
              Đơn hàng:{" "}
              <span className="font-mono font-bold">
                {statusUpdateModal.code}
              </span>
            </p>
            <p className="mb-4">
              Trạng thái hiện tại:
              <Tag
                color={
                  statusConfig[
                    statusUpdateModal.currentStatus as keyof typeof statusConfig
                  ]?.color
                }
                className="ml-2"
              >
                {
                  statusConfig[
                    statusUpdateModal.currentStatus as keyof typeof statusConfig
                  ]?.text
                }
              </Tag>
            </p>
            <div>
              <p className="mb-2">Chọn trạng thái mới:</p>
              <Space direction="vertical" style={{ width: "100%" }}>
                {Object.entries(statusConfig).map(([status, config]) => (
                  <Button
                    key={status}
                    block
                    type={
                      status === statusUpdateModal.currentStatus
                        ? "default"
                        : "primary"
                    }
                    disabled={status === statusUpdateModal.currentStatus}
                    loading={isUpdating}
                    onClick={() => handleConfirmStatusUpdate(status)}
                    style={{
                      justifyContent: "flex-start",
                      borderColor: config.color,
                      ...(status !== statusUpdateModal.currentStatus && {
                        backgroundColor: config.color,
                        borderColor: config.color,
                      }),
                    }}
                  >
                    <Tag color={config.color} style={{ marginRight: 8 }}>
                      {config.text}
                    </Tag>
                    {status === statusUpdateModal.currentStatus && "(Hiện tại)"}
                  </Button>
                ))}
              </Space>
            </div>
          </div>
        </Modal>
      </Content>
    </Layout>
  );
}
