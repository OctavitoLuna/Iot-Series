import React, { createContext, useContext, useState, useEffect } from "react";
import { User, MockAPI } from "../api/mockService";

interface AuthContextType {
  user: User | null;
  login: (email: string, password?: string) => Promise<void>;
  signup: (email: string, fullName: string, password?: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("iot_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password?: string) => {
    setLoading(true);
    try {
      const loggedInUser = await MockAPI.login(email, password);
      setUser(loggedInUser);
      localStorage.setItem("iot_user", JSON.stringify(loggedInUser));
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, fullName: string, password?: string) => {
    setLoading(true);
    try {
      const newUser = await MockAPI.signup(email, fullName, password);
      setUser(newUser);
      localStorage.setItem("iot_user", JSON.stringify(newUser));
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("iot_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
