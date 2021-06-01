import React, { createContext, useCallback, useContext, useState } from 'react';
import { LoginDto } from '../dto/login';
import api from '../service/api';
import { useToast } from './toast';

interface Response {
  token: string;
}

interface AuthContext {
  login(data: LoginDto): Promise<void>;
  logOut(): void;
  token?: string;
}

const AuthContext = createContext({} as AuthContext);

const AuthProvider: React.FC = ({ children }) => {
  // hook
  const { addToast } = useToast();

  // state
  const [token, setToken] = useState<string | undefined>(() => {
    return localStorage.getItem('@sttigma:token') || undefined;
  });

  const login = useCallback(async (data: LoginDto) => {
    try {
      const loginData: LoginDto = {
        email: data.email.toLowerCase(),
        password: data.password,
      };
      const response = await api.post<Response>('users/auth', loginData);
      localStorage.setItem('@sttigma:token', response.data.token);
      setToken(response.data.token);
    } catch (error) {
      addToast({
        title: 'Ops!',
        description: 'E-mail ou senha incorreto',
        type: 'error',
      });
    }
  }, []);

  const logOut = useCallback(() => {
    setToken(undefined);
    localStorage.removeItem('@sttigma:token');
  }, [token]);

  return (
    <AuthContext.Provider value={{ login, logOut, token }}>
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContext {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within a ToastPrivder');
  }
  return context;
}

export { AuthProvider, useAuth };
