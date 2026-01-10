export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  department:string;
  role?: 'admin' | 'staff' | 'user';
  employeeId?: string;
  position?: string;
  joinDate?: string;
  status?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  accessToken: string | null;
  isAuthenticated: boolean;
  updateUser: (updatedData: User) => Promise<void>;
  login: (credentials: any) => Promise<{ success: boolean; message?: any }>;
  signup: (userData: any) => Promise<{ success: boolean; message?: any }>;
  logout: () => Promise<{success: boolean; message?: any}>;
}
