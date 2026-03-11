import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  PlusCircle,
  Database,
  Activity,
  LogOut,
  Menu,
  X,
  ActivitySquare,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/Button";

export const MainLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems =
    user?.role === "Admin"
      ? [
          { name: "Panel", path: "/admin", icon: LayoutDashboard },
          { name: "Base de Datos", path: "/admin/database", icon: Database },
          { name: "Auditoría", path: "/admin/logs", icon: Activity },
        ]
      : [
          { name: "Mis Series", path: "/user", icon: LayoutDashboard },
          { name: "Crear Serie", path: "/user/create", icon: PlusCircle },
        ];

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="flex h-screen bg-cream text-charcoal font-sans overflow-hidden">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-beige bg-white">
        <div className="p-8 flex items-center gap-3">
          <ActivitySquare className="h-8 w-8 text-moss" />
          <span className="text-2xl font-serif font-bold tracking-tight">
            IoT Math
          </span>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all",
                  isActive
                    ? "bg-moss/10 text-moss font-medium"
                    : "text-charcoal/60 hover:bg-charcoal/5 hover:text-charcoal",
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-6 border-t border-beige">
          <div className="flex items-center gap-3 px-2 mb-4">
            <div className="h-10 w-10 rounded-full bg-terracotta/20 text-terracotta flex items-center justify-center font-serif font-bold text-lg">
              {user?.fullName?.charAt(0).toUpperCase() ||
                user?.email.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium truncate">
                {user?.fullName || user?.email}
              </span>
              <span className="text-xs text-charcoal/50">{user?.role}</span>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-terracotta hover:text-terracotta hover:bg-terracotta/10 rounded-2xl"
            onClick={logout}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Cerrar Sesión
          </Button>
        </div>
      </aside>

      {/* Mobile Header & Menu */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 border-b border-beige bg-white flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-2">
          <ActivitySquare className="h-6 w-6 text-moss" />
          <span className="text-xl font-serif font-bold">IoT Math</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-charcoal/60 hover:text-charcoal"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-cream z-40 flex flex-col">
          <nav className="flex-1 p-4 space-y-2 mt-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeMobileMenu}
                  className={cn(
                    "flex items-center gap-3 px-4 py-4 rounded-2xl transition-all text-lg",
                    isActive
                      ? "bg-moss/10 text-moss font-medium"
                      : "text-charcoal/60 hover:bg-charcoal/5 hover:text-charcoal",
                  )}
                >
                  <Icon className="h-6 w-6" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
          <div className="p-6 border-t border-beige bg-white">
            <Button
              variant="ghost"
              className="w-full justify-start text-terracotta hover:text-terracotta hover:bg-terracotta/10 text-lg py-6 rounded-2xl"
              onClick={logout}
            >
              <LogOut className="h-6 w-6 mr-3" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pt-16 md:pt-0 bg-cream">
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
