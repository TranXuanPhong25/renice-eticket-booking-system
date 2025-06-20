"use client";

import { useState } from "react";
import { Button, Input, Form, Divider, Checkbox, message } from "antd";
import { Container } from "@/components/Container";
import Image from "next/image";
import Link from "next/link";
import {
   IoEyeOutline,
   IoEyeOffOutline,
   IoPhonePortraitOutline,
   IoMailOutline,
   IoLockClosedOutline,
   IoLogoGoogle,
   IoLogoFacebook
} from "react-icons/io5";
import { FaApple } from "react-icons/fa";

interface LoginFormData {
   identifier: string; // email or phone
   password: string;
   remember: boolean;
}

export default function LoginPage() {
   const [form] = Form.useForm();
   const [loading, setLoading] = useState(false);
   const [passwordVisible, setPasswordVisible] = useState(false);
   const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');

   const onFinish = async (values: LoginFormData) => {
      setLoading(true);
      try {
         // Simulate API call
         await new Promise(resolve => setTimeout(resolve, 1500));
         message.success('Đăng nhập thành công!');
         // Redirect logic would go here
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
                  {/* Login Card */}
                  <div className="bg-white rounded-2xl shadow-xl p-8">
                     {/* Header */}
                     <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Đăng nhập</h1>
                        <p className="text-gray-600">Chào mừng bạn quay trở lại!</p>
                     </div>

                     {/* Login Method Toggle */}
                     <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
                        <button
                           type="button"
                           onClick={() => setLoginMethod('email')}
                           className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-all ${loginMethod === 'email'
                                 ? 'bg-white text-blue-600 shadow-sm'
                                 : 'text-gray-600 hover:text-gray-900'
                              }`}
                        >
                           <IoMailOutline size={16} />
                           Email
                        </button>
                        <button
                           type="button"
                           onClick={() => setLoginMethod('phone')}
                           className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-all ${loginMethod === 'phone'
                                 ? 'bg-white text-blue-600 shadow-sm'
                                 : 'text-gray-600 hover:text-gray-900'
                              }`}
                        >
                           <IoPhonePortraitOutline size={16} />
                           Số điện thoại
                        </button>
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
                           label={loginMethod === 'email' ? 'Email' : 'Số điện thoại'}
                           rules={[
                              {
                                 required: true,
                                 message: `Vui lòng nhập ${loginMethod === 'email' ? 'email' : 'số điện thoại'}!`,
                              },
                              loginMethod === 'email' ? {
                                 type: 'email',
                                 message: 'Email không hợp lệ!',
                              } : {
                                 pattern: /^[0-9]{10,11}$/,
                                 message: 'Số điện thoại không hợp lệ!',
                              },
                           ]}
                        >
                           <Input
                              prefix={loginMethod === 'email' ? <IoMailOutline /> : <IoPhonePortraitOutline />}
                              placeholder={loginMethod === 'email' ? 'example@email.com' : '0987654321'}
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
                           <IoLogoGoogle className="text-red-500" size={20} />
                           <span>Tiếp tục với Google</span>
                        </Button>

                        <Button
                           size="large"
                           className="w-full h-12 flex items-center justify-center gap-3 border-gray-300 hover:border-blue-600 hover:text-blue-600 rounded-lg"
                           onClick={() => handleSocialLogin('Facebook')}
                        >
                           <IoLogoFacebook className="text-blue-600" size={20} />
                           <span>Tiếp tục với Facebook</span>
                        </Button>

                        <Button
                           size="large"
                           className="w-full h-12 flex items-center justify-center gap-3 border-gray-300 hover:border-gray-800 hover:text-gray-800 rounded-lg"
                           onClick={() => handleSocialLogin('Apple')}
                        >
                           <FaApple className="text-gray-800" size={20} />
                           <span>Tiếp tục với Apple</span>
                        </Button>
                     </div>
                     <div className="text-sm text-gray-600">
                        Chưa có tài khoản?{" "}
                        <Link href="/auth/register" className="text-blue-600 hover:text-blue-800 font-medium">
                           Đăng ký ngay
                        </Link>
                     </div>
                     {/* Terms */}
                     <div className="mt-8 text-center text-xs text-gray-500">
                        Bằng việc đăng nhập, bạn đồng ý với{" "}
                        <Link href="/terms" className="text-blue-600 hover:underline">
                           Điều khoản dịch vụ
                        </Link>{" "}
                        và{" "}
                        <Link href="/privacy" className="text-blue-600 hover:underline">
                           Chính sách bảo mật
                        </Link>{" "}
                        của chúng tôi.
                     </div>
                  </div>

                  {/* Additional Info */}
                  <div className="text-center mt-8 text-sm text-gray-600">
                     <p>Gặp khó khăn khi đăng nhập?</p>
                     <Link href="/help" className="text-blue-600 hover:text-blue-800 font-medium">
                        Liên hệ hỗ trợ
                     </Link>
                  </div>
               </div>
            </div>
         </Container>
      </div>
   );
}
