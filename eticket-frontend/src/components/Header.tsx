"use client";
import { Button } from "antd";
import { AppMenu } from "./AppMenu";
import { Container } from "./Container";
import Link from "next/link";
import { useAuth } from "@/context/AuthProvider"; // Adjust the import path as necessary
export const Header = () => {
  const { loginWithRedirect } = useAuth(); // Use the loginWithRedirect function from AuthProvider
  const currentPath = typeof window !== "undefined" ? window.location.pathname : "/";
  const handleLogin = () => {
    loginWithRedirect(currentPath); // Redirect to home after login
  };
  return (
    <div className="shadow-sm px-10">
      <Container>
        <div className="flex items-center justify-between">
          <div className="font-bold text-blue-600">eTicket</div>
          <AppMenu />
          <Button type="primary" className="bg-blue-500 hover:bg-blue-600" onClick={handleLogin}>
            Đăng nhập
          </Button>
        </div>
      </Container>
    </div>
  );
};
