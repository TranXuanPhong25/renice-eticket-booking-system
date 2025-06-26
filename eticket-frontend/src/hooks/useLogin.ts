import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthProvider';
import { useRouter } from 'next/navigation';

// Định nghĩa kiểu dữ liệu
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    name?: string;
    role: string;
  };
  accessToken?: string;
  // Các trường khác có thể có
}

// Hook useLogin
export const useLogin = () => {
  const { login } = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<LoginResponse, Error, LoginCredentials>({
    mutationFn: async (credentials: LoginCredentials) => {
      try {
        const response = await login(credentials.email, credentials.password);
        return response;
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      // Invalidate user queries to refetch user data
      queryClient.invalidateQueries({ queryKey: ['user'] });
      
      // Optionally, redirect after login
      if (data.user.role === 'ADMIN') {
        router.push('/admin/events');
      } else {
        router.push('/');
      }
    },
  });
};
