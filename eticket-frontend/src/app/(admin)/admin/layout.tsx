"use client";

import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, theme, Button } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  DashboardOutlined,
  CalendarOutlined,
  SettingOutlined,
  LogoutOutlined,
  PlusCircleOutlined,
  TeamOutlined,
  TagsOutlined, // Using TagsOutlined as an alternative for tickets
} from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthProvider';

const { Header, Sider, Content } = Layout;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Hồ sơ admin',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Cài đặt',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      danger: true,
    },
  ];

  const handleMenuClick = (e: any) => {
    if (e.key === 'logout') {
      logout();
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed} 
        width={260}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100
        }}
      >
        <div style={{ 
          height: 64, 
          margin: '16px 0', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <h1 style={{ 
            color: 'white', 
            margin: 0, 
            fontSize: collapsed ? '16px' : '24px',
            fontWeight: 600,
            transition: 'all 0.2s'
          }}>
            {collapsed ? 'ET' : 'E-Ticket Admin'}
          </h1>
        </div>
        
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname || '']}
          defaultOpenKeys={['/admin/events']}
          items={[
            {
              key: '/admin',
              icon: <DashboardOutlined />,
              label: <Link href="/admin">Dashboard</Link>,
            },
            {
              key: 'events',
              icon: <CalendarOutlined />,
              label: 'Sự kiện',
              children: [
                {
                  key: '/admin/events',
                  label: <Link href="/admin/events">Danh sách sự kiện</Link>,
                },
                {
                  key: '/admin/events/create',
                  label: <Link href="/admin/events/create">Tạo sự kiện mới</Link>,
                },
              ],
            },
            {
              key: '/admin/tickets',
              icon: <TagsOutlined />,
              label: <Link href="/admin/tickets">Quản lý vé</Link>,
            },
            {
              key: '/admin/users',
              icon: <TeamOutlined />,
              label: <Link href="/admin/users">Quản lý người dùng</Link>,
            },
            {
              key: '/admin/settings',
              icon: <SettingOutlined />,
              label: <Link href="/admin/settings">Cài đặt hệ thống</Link>,
            },
          ]}
        />
      </Sider>
      
      <Layout style={{ marginLeft: collapsed ? 80 : 260, transition: 'all 0.2s' }}>
        <Header style={{ 
          padding: '0 24px', 
          background: colorBgContainer, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 99,
          boxShadow: '0 1px 4px rgba(0,21,41,.08)'
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
          
          <Dropdown 
            menu={{ 
              items: userMenuItems,
              onClick: handleMenuClick 
            }} 
            placement="bottomRight"
            arrow
          >
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>{user?.username || 'Admin'}</span>
              <Avatar 
                style={{ backgroundColor: '#1890ff' }}
                icon={<UserOutlined />} 
              />
            </div>
          </Dropdown>
        </Header>
        
        <Content style={{ 
          margin: '24px 16px', 
          padding: 24, 
          background: colorBgContainer, 
          borderRadius: borderRadiusLG, 
          minHeight: 280
        }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
