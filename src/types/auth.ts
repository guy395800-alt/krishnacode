export type UserRole = 'student' | 'admin' | 'instructor';

export interface User {
  id: string | number;
  email: string;
  full_name: string;
  role: UserRole;
  registration_number?: string;
  department?: string;
  college_name?: string;
  avatar_url?: string;
  requires_password_change?: boolean;
  provider?: 'local' | 'google' | 'github';
  created_at?: string;
}

export interface GoogleAuthPayload {
  email: string;
  name: string;
  picture?: string;
  sub?: string;
  role?: UserRole;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  theme: 'dark' | 'light';
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  loginWithGoogle: (payload?: Partial<GoogleAuthPayload>) => Promise<User>;
  logout: () => void;
  toggleTheme: () => void;
  updateUser: (data: Partial<User>) => void;
}
