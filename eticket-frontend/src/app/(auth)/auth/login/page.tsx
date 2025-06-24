"use client";

import { useState } from "react";
import { Button, Input, Form, Divider, Checkbox, message } from "antd";
import { Container } from "@/components/Container";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from '../../../../context/AuthProvider';
import {
   IoEyeOutline,
   IoEyeOffOutline,
   IoMailOutline,
   IoLockClosedOutline,
   IoLogoGoogle,
   IoLogoFacebook
} from "react-icons/io5";

interface LoginFormData {
   identifier: string; // email
   password: string;
   remember: boolean;
}

export default function LoginPage() {
   const { login } = useAuth();
   const [form] = Form.useForm();
   const [loading, setLoading] = useState(false);
   const onFinish = async (values: LoginFormData) => {
      setLoading(true);
      try {
         await login(
            values.identifier,
            values.password,
         );
      } catch (error) {
         message.error('Đăng nhập thất bại. Vui lòng thử lại!');
      } finally {
         setLoading(false);
      }
   };

   const handleSocialLogin = (provider: string) => {
      message.info(`Đăng nhập với ${provider} - Chức năng đang phát triển`);
   };

   return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
         {/* Main Content */}
         <Container>
            <div className="flex items-center justify-center min-h-[calc(100vh-80px)] py-12">
               <div className="w-full max-w-md">
                  <Link href="/" className=" block text-center mb-8 text-4xl font-bold text-sky-500">Chan Ticket</Link>
                  {/* Login Card */}
                  <div className="bg-white rounded-2xl shadow-xl p-8">

                     {/* Header */}
                     <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Đăng nhập</h1>
                        <p className="text-gray-600">Chào mừng bạn quay trở lại!</p>
                     </div>

                     {/* Login Form */}
                     <Form
                        form={form}
                        name="login"
                        onFinish={onFinish}
                        layout="vertical"
                        size="large"
                        requiredMark={false}
                     >
                        <Form.Item
                           name="identifier"
                           label="Email"
                           rules={[
                              {
                                 required: true,
                                 message: 'Vui lòng nhập email!',
                              },
                              {
                                 type: 'email',
                                 message: 'Email không hợp lệ!',
                              },
                           ]}
                        >
                           <Input
                              prefix={<IoMailOutline />}
                              placeholder="example@email.com"
                              className="rounded-lg"
                           />
                        </Form.Item>

                        <Form.Item
                           name="password"
                           label="Mật khẩu"
                           rules={[
                              {
                                 required: true,
                                 message: 'Vui lòng nhập mật khẩu!',
                              },
                              {
                                 min: 6,
                                 message: 'Mật khẩu phải có ít nhất 6 ký tự!',
                              },
                           ]}
                        >
                           <Input.Password
                              prefix={<IoLockClosedOutline />}
                              placeholder="Nhập mật khẩu"
                              iconRender={(visible) =>
                                 visible ? <IoEyeOffOutline /> : <IoEyeOutline />
                              }
                              className="rounded-lg"
                           />
                        </Form.Item>

                        {/* Remember & Forgot Password */}
                        <div className="flex items-center justify-between mb-6">
                           <Form.Item name="remember" valuePropName="checked" className="mb-0">
                              <Checkbox className="text-sm text-gray-600">
                                 Ghi nhớ đăng nhập
                              </Checkbox>
                           </Form.Item>
                           <Link
                              href="/auth/forgot-password"
                              className="text-sm text-blue-600 hover:text-blue-800"
                           >
                              Quên mật khẩu?
                           </Link>
                        </div>

                        {/* Login Button */}
                        <Form.Item className="mb-0">
                           <Button
                              type="primary"
                              htmlType="submit"
                              loading={loading}
                              className="w-full h-12 text-base font-medium bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border-none rounded-lg"
                           >
                              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                           </Button>
                        </Form.Item>
                     </Form>

                     {/* Divider */}
                     <Divider className="my-8">
                        <span className="text-gray-500 text-sm">Hoặc đăng nhập với</span>
                     </Divider>

                     {/* Social Login */}
                     <div className="space-y-3">
                        <Button
                           size="large"
                           className="w-full h-12 flex items-center justify-center gap-3 border-gray-300 hover:border-red-400 hover:text-red-500 rounded-lg"
                           onClick={() => handleSocialLogin('Google')}
                        >
                           <Image src="/google-logo.svg" alt="Google" width={20} height={20} />
                           <span>Tiếp tục với Google</span>
                        </Button>

                     </div>
                     <div className="text-sm text-gray-600 text-center mt-4">
                        Chưa có tài khoản?{" "}
                        <Link href="/auth/register" className="text-blue-600 hover:text-blue-800 font-medium">
                           Đăng ký ngay
                        </Link>
                     </div>

                  </div>


               </div>
            </div>
         </Container>
      </div>
   );
}
