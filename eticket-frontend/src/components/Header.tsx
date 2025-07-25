"use client";
import { Button, Dropdown, Avatar, Space, Skeleton, Badge, Tooltip } from "antd";
import { Container } from "./Container";
import Link from "next/link";
import { 
  UserOutlined, 
  LogoutOutlined, 
  SettingOutlined, 
  ShoppingOutlined, 
  BellOutlined,
  QuestionCircleOutlined,
  HomeOutlined
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { IoLogOutOutline } from "react-icons/io5";
import { useAuth } from "@/context/AuthProvider";

export const Header = () => {
  const router = useRouter();
  const { user, loading,  logout } = useAuth();
  const [isClient, setIsClient] = useState(false);
  
  // Set isClient to true after component mounts to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);
    
  // Get current path for redirect after login
  const currentPath = isClient ? window.location.pathname : "/";
  
  const handleLogin = () => {
    router.push(`/auth/login?redirectTo=${encodeURIComponent(currentPath)}`);
  };
  
  const handleLogout = async () => {
    await logout();
    router.push(window.location.pathname); // Redirect to current page after logout
  };
  
  // User dropdown menu items
  const userMenuItems = [
    {
      key: 'orders',
      label: 'Đơn hàng của tôi',
      icon: <ShoppingOutlined />,
      onClick: () => router.push('/order')
    },
    {
      key: 'logout',
      label: 'Đăng xuất',
      icon: <IoLogOutOutline />,
      onClick: handleLogout
    }
  ];
  // Add admin dashboard link if user is admin
  if (user?.role === 'ROLE_ADMIN') {
    userMenuItems.unshift({
      key: 'admin',
      label: 'Admin Dashboard',
      icon: <SettingOutlined />,
      onClick: () => router.push('/admin/events')
    });
  }
  
  // User dropdown if logged in
  const userDropdown = (
    <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
      <Space className="cursor-pointer">
        <Avatar 
          icon={<UserOutlined />} 
          src={user?.avatar} 
          size="small"
        />
        <span>{user?.username?.replace(/@.+/,'')}</span>
      </Space>
    </Dropdown>
  );
  
  return (
    <div className="shadow-sm px-10">
      <Container>
        <div className="flex items-center justify-between h-16">
          <div className="font-bold text-blue-600">
            <Link href="/" className="flex items-center">
              <ShoppingOutlined className="mr-1 text-xl" /> eTicket
            </Link>
          </div>
          
          
          
          {/* Authentication UI with conditional rendering to prevent flickering */}
          <div className="flex items-center">
           
            
            <div className="min-w-[100px] ml-2 flex justify-end">
              {!isClient || loading ? (
                <Skeleton.Button active size="small" shape="default" />
              ) : user ? (
                userDropdown
              ) : (
                <Button 
                  type="primary" 
                  className="bg-blue-500 hover:bg-blue-600" 
                  onClick={handleLogin}
                >
                  Đăng nhập
                </Button>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
