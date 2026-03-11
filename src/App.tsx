import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { MainLayout } from "./components/layout/MainLayout";
import { Login } from "./pages/auth/Login";
import { Dashboard } from "./pages/user/Dashboard";
import { SeriesCreator } from "./pages/user/SeriesCreator";
import { SeriesDetail } from "./pages/user/SeriesDetail";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { DatabaseExplorer } from "./pages/admin/DatabaseExplorer";
import { AuditLogs } from "./pages/admin/AuditLogs";
import { Spinner } from "./components/ui/Spinner";

const ProtectedRoute = ({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: ("Admin" | "User")[];
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <Spinner className="h-12 w-12 text-moss" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === "Admin" ? "/admin" : "/user"} replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* User Routes */}
      <Route
        path="/user"
        element={
          <ProtectedRoute allowedRoles={["User"]}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="create" element={<SeriesCreator />} />
        <Route path="series/:id" element={<SeriesDetail />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="database" element={<DatabaseExplorer />} />
        <Route path="logs" element={<AuditLogs />} />
      </Route>

      {/* Default Redirect */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
