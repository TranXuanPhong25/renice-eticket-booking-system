"use client"
import { createContext, useContext, useState, useEffect } from 'react';
type AuthContextType = {
   user: any; // Replace with your user type
   loading: boolean;
   login: (email: string, password: string) => Promise<any>;
   register: (email: string, password: string) => Promise<any>;
   logout: () => Promise<void>;
   loginWithRedirect: (redirectTo: string) => Promise<void>;
   checkAuthStatus: () => Promise<void>;
}
import { loginAction, register, logoutAction } from '@/server/auth'; // Adjust the import path as necessary
import { redirect, useRouter } from 'next/navigation';
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
   const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true);
   const [redirectTo, setRedirectTo] = useState("/");
   const router = useRouter();
   // Check auth status on mount
   useEffect(() => {
      checkAuthStatus();
   }, []);
   const loginWithRedirect = async (redirectTo: string) => {
      setRedirectTo(redirectTo);
      redirect('/auth/login');
   };
   const checkAuthStatus = async () => {
      try {
         setLoading(true);
         // This will include session cookie automatically
         // const response = await axios.get(process.env.NEXT_PUBLIC_API + '/auth/me', { withCredentials: true });
         // setUser(response.data);
      } catch (error) {
         setUser(null);
      } finally {
         setLoading(false);
      }
   };
   const logout = async () => {
      logoutAction(setUser);
   };
   const login = async (email: string, password: string) => {
      const response = await loginAction(email, password);
      setUser(response);
      const dest = redirectTo;
      if (redirectTo) {
         setRedirectTo("/");
      }
      router.push(dest ?? "/");
   }
   return (
      <AuthContext.Provider value={{ user, loading, login, register, logout, loginWithRedirect, checkAuthStatus }}>
         {children}
      </AuthContext.Provider>
   );
}

export const useAuth = () => {
   const context = useContext(AuthContext);
   if (context === undefined) {
      throw new Error('useAuth must be used within an AuthProvider');
   }
   return context;
}