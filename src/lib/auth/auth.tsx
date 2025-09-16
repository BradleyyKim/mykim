"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "../api/client";
import { Loader2 } from "lucide-react";

// 사용자 타입 정의
type User = {
  id: number;
  username: string;
  email: string;
};

// 인증 컨텍스트 타입 정의
interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

// 인증 컨텍스트 생성
const AuthContext = createContext<AuthContextType | null>(null);

// 인증 상태 제공자 컴포넌트
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // 인증 상태 확인 함수
  const checkAuth = useCallback(async (): Promise<boolean> => {
    try {
      const authStatus = await apiClient.checkAuthStatus();
      setIsLoggedIn(authStatus.isLoggedIn);

      if (authStatus.isLoggedIn && authStatus.user) {
        setUser(authStatus.user);
        return true;
      } else {
        setUser(null);
        return false;
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setIsLoggedIn(false);
      setUser(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 초기 로드 시 인증 상태 확인
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // 로그인 함수
  const login = async (identifier: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiClient.login({ identifier, password });
      if (response.user) {
        setUser(response.user);
        setIsLoggedIn(true);
        router.refresh();
      }
    } catch (error) {
      console.error("로그인 오류:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 로그아웃 함수
  const logout = async () => {
    setIsLoading(true);
    try {
      await apiClient.logout();
      setUser(null);
      setIsLoggedIn(false);
      router.refresh();
    } catch (error) {
      console.error("로그아웃 오류:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, isLoading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

// 인증 컨텍스트 사용 훅
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth는 AuthProvider 내에서 사용해야 합니다");
  }
  return context;
}

// 인증된 사용자만 접근 가능한 래퍼 컴포넌트
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isLoggedIn, isLoading, checkAuth } = useAuth();
  const router = useRouter();
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  useEffect(() => {
    const verify = async () => {
      const isAuthenticated = await checkAuth();

      if (!isAuthenticated) {
        router.push("/admin");
      }

      setInitialCheckDone(true);
    };

    verify();
  }, [checkAuth, router]);

  if (isLoading || !initialCheckDone) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return null; // 리다이렉트 중에는 아무 것도 표시하지 않음
  }

  return <>{children}</>;
}
