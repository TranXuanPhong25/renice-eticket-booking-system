"use server";
import axios from "axios";
import { cookies } from "next/headers";
import { SetStateAction } from "react";

const loginAction = async (email: string, password: string) => {
   const body = { email:email,password:password }
   const response = await axios.post(process.env.NEXT_PUBLIC_API + '/auth/login',body , { withCredentials: true });
   (await cookies()).set('access_token', response.data.accessToken, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
   });
   return response.data;
};
const register = async (email: string, password: string) => {
   const response = await axios.post(process.env.NEXT_PUBLIC_API + '/auth/register', { email, password }, { withCredentials: true });
   (await cookies()).set('access_token', response.data.access_token, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
   });
   return response.data;
}
const logoutAction = async (setUser:SetStateAction<any>) => {
   await axios.post(process.env.NEXT_PUBLIC_API + '/auth/logout', {}, { withCredentials: true });
   setUser(null);
};

export { loginAction, register, logoutAction };