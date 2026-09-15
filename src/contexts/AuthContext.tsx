import { createContext, useContext, useState, useEffect } from 'react';
import type {ReactNode} from 'react'
import { api } from '../services/api';
import type { ViewType
 } from '../App';

export interface User {
  id?: string;
  name: string;
  email: string;
  department?: string;
  initials?: string;
  avatarColor?: string;
  bio?: string;
  role: string;
  picture: string;
  surname?: string;
  phone?: string;
  registrationNumber?: string;
  campus?: string;
  notifyDailySummary?: boolean;
  notifyMonthlyReports?: boolean;
  notifyNewExpenses?: boolean;
  notifySystemAlerts?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  userRole: string | null;    
  effectiveRole: string | null; 
  isStudentView: boolean;
  toggleStudentView: () => void;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  updateUser: (updatedData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('@App:user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isStudentView, setIsStudentView] = useState(false);
  const [loading, setLoading] = useState(true);
  const [_, setCurrentView] = useState<ViewType>(() =>
    user?.role === 'ROLE_ADMIN' ? 'admin' : 'analytics'
  );

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
        setUserRole(parsedUser.role || localStorage.getItem('userRole'));
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      } catch (e) {
        console.error('Erro ao restaurar sessão:', e);
      }
    }
    setLoading(false);
  }, []);

  const toggleStudentView = () => {
    setIsStudentView(!isStudentView)
    setCurrentView(isStudentView ? 'analytics' : 'admin')
  };

  const updateUser = (updatedData: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const newUser = { ...prev, ...updatedData };
      localStorage.setItem('@App:user', JSON.stringify(newUser));
      return newUser;
    });
  };

  const effectiveRole = isStudentView ? 'ROLE_USER' : userRole;

  const login = (newToken: string, userData: User) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('userRole', userData.role);

    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

    setToken(newToken);
    setUser(userData);
    setUserRole(userData.role);
    setIsStudentView(false);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');

    delete api.defaults.headers.common['Authorization'];

    setToken(null);
    setUser(null);
    setUserRole(null);
    setIsStudentView(false);
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      userRole,
      effectiveRole,
      isStudentView,
      toggleStudentView,
      login, 
      logout, 
      isAuthenticated: !!token,
      updateUser

    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);