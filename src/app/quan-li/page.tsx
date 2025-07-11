"use client";

import { useAuth } from "@/hooks/useAuth";
import LoginForm from "@/components/LoginForm";
import OrdersManagement from "@/components/OrdersManagement";

export default function AdminPage() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang kiểm tra xác thực...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return <OrdersManagement />;
}
