"use client";

import { useState } from "react";
import { Button, Input, Form, Checkbox, message } from "antd";
import { IoMailOutline, IoLockClosedOutline } from "react-icons/io5";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthProvider";
export default function RegisterPage() {
   const { register } = useAuth(); 
   const [form] = Form.useForm();
   const [sending, setSending] = useState(false);
   const [codeSent, setCodeSent] = useState(false);
   const [countdown, setCountdown] = useState(0);
   const [agree, setAgree] = useState(false);

   const sendCode = async () => {
      try {
         await form.validateFields(["email"]);
         setSending(true);
         setCountdown(60);
         setCodeSent(true);
         message.success("Đã gửi mã xác minh đến email!");
         const timer = setInterval(() => {
            setCountdown((prev) => {
               if (prev <= 1) {
                  clearInterval(timer);
                  return 0;
               }
               return prev - 1;
            });
         }, 1000);
      } catch { }
      setSending(false);
   };

   const onFinish = (values: any) => {
      if (!agree) {
         message.error("Bạn cần đồng ý với điều khoản và điều kiện!");
         return;
      }
      const { email, code, password } = values;
      // Here you would typically send the registration data to your backend
      const response = register(email, password);
   };

   return (
      <div className="min-h-screen flex-col flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
         <Link href="/" className="text-center mb-8 text-4xl font-bold text-sky-500">Chan Ticket</Link>

         <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8">

            <h1 className="text-2xl font-bold text-center mb-6">Đăng ký tài khoản</h1>
            <Form
               form={form}
               layout="vertical"
               onFinish={onFinish}
               requiredMark={false}
            >
               <div className="font-semibold mb-2">Xác minh email</div>
               <Form.Item
                  name="email"
                  rules={[
                     { required: true, message: "Vui lòng nhập email!" },
                     { type: "email", message: "Email không hợp lệ!" },
                  ]}
               >
                  <Input
                     prefix={<IoMailOutline />}
                     placeholder="Nhập địa chỉ email"
                     size="large"
                     autoComplete="email"
                  />
               </Form.Item>
               <Form.Item className="mb-2">
                  <div className="flex gap-2">
                     <Form.Item
                        name="code"
                        noStyle
                        rules={[
                           { required: true, message: "Vui lòng nhập mã xác minh!" },
                        ]}
                     >
                        <Input
                           prefix={<IoLockClosedOutline />}
                           placeholder="Nhập mã xác minh"
                           size="large"
                           autoComplete="one-time-code"
                           disabled={!codeSent}
                        />
                     </Form.Item>
                     <Button
                        type="default"
                        size="large"
                        onClick={sendCode}
                        loading={sending}
                        disabled={sending || countdown > 0}
                        className="min-w-[90px]"
                     >
                        {countdown > 0 ? `Gửi lại (${countdown}s)` : "Gửi mã"}
                     </Button>
                  </div>
               </Form.Item>
               <div className="text-xs text-gray-500 mb-4">
                  Nhập email và nhấn "Gửi mã", sau đó vui lòng kiểm tra hộp thư đến và làm theo hướng dẫn.
               </div>

               <div className="font-semibold mb-2">Thiết lập mật khẩu</div>
               <Form.Item
                  name="password"
                  rules={[
                     { required: true, message: "Vui lòng nhập mật khẩu!" },
                     { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
                  ]}
               >
                  <Input.Password
                     prefix={<IoLockClosedOutline />}
                     placeholder="Nhập mật khẩu"
                     size="large"
                     autoComplete="new-password"
                  />
               </Form.Item>
               <Form.Item
                  name="confirm"
                  dependencies={["password"]}
                  rules={[
                     { required: true, message: "Vui lòng xác nhận mật khẩu!" },
                     ({ getFieldValue }) => ({
                        validator(_, value) {
                           if (!value || getFieldValue("password") === value) {
                              return Promise.resolve();
                           }
                           return Promise.reject(new Error("Mật khẩu xác nhận không khớp!"));
                        },
                     }),
                  ]}
               >
                  <Input.Password
                     prefix={<IoLockClosedOutline />}
                     placeholder="Xác nhận mật khẩu"
                     size="large"
                     autoComplete="new-password"
                  />
               </Form.Item>
               <Form.Item className="mb-2">
                  <Checkbox checked={agree} onChange={e => setAgree(e.target.checked)}>
                     Đồng ý với <Link href="/terms" className="text-blue-600">Điều kiện và điều khoản</Link>
                  </Checkbox>
               </Form.Item>
               <Form.Item>
                  <Button
                     type="primary"
                     htmlType="submit"
                     block
                     size="large"
                     disabled={!agree}
                     className="bg-pink-400 hover:bg-pink-500 border-none font-semibold"
                  >
                     Đăng ký tài khoản
                  </Button>
               </Form.Item>
            </Form>
            <div className="flex items-center my-4">
               <div className="flex-1 border-t border-gray-200"></div>
               <span className="mx-2 text-gray-400 text-sm">Hoặc đăng ký với</span>
               <div className="flex-1 border-t border-gray-200"></div>
            </div>
            <div className="flex gap-3 mb-4 justify-center ">
               <Button type="text" className="!px-2 !rounded-full">
                  <Image src="/google-logo.svg" alt="Google" width={20} height={20} />
               </Button>
            </div>
            <div className="text-sm text-gray-600 text-center mt-4">
               Đã có tài khoản?{" "}
               <Link href="/auth/login" className="text-blue-600 hover:text-blue-800 font-medium">
                  Đăng nhập ngay
               </Link>
            </div>
         </div>
      </div>
   );
}
