import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { ActivitySquare, Loader2 } from "lucide-react";

export const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, signup, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("El correo y la contraseña son obligatorios");
      return;
    }

    if (!isLogin && !fullName.trim()) {
      setError("El nombre completo es obligatorio");
      return;
    }

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, fullName, password);
      }
      // The ProtectedRoute will handle redirecting to the correct dashboard based on role
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Error de autenticación. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream p-4">
      <Card className="w-full max-w-md border-beige/50 bg-white shadow-xl shadow-charcoal/5">
        <CardHeader className="space-y-1 flex flex-col items-center text-center pb-8 pt-10">
          <div className="w-16 h-16 bg-moss/10 rounded-[20px] flex items-center justify-center mb-6">
            <ActivitySquare className="h-8 w-8 text-moss" />
          </div>
          <CardTitle className="text-3xl font-serif tracking-tight text-charcoal">
            {isLogin ? "Bienvenido de nuevo" : "Crear una cuenta"}
          </CardTitle>
          <CardDescription className="text-charcoal/60 mt-2 text-base">
            {isLogin
              ? "Ingresa tus credenciales para acceder a tu cuenta"
              : "Regístrate para empezar a gestionar tus series"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5 px-8">
            {!isLogin && (
              <div className="space-y-2">
                <label
                  htmlFor="fullName"
                  className="text-sm font-medium leading-none text-charcoal/80"
                >
                  Nombre Completo
                </label>
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            )}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium leading-none text-charcoal/80"
              >
                Correo Electrónico
              </label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium leading-none text-charcoal/80"
              >
                Contraseña
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && (
              <p className="text-sm text-red-500 font-medium">{error}</p>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-6 pt-6 pb-10 px-8">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLogin ? "Iniciar Sesión" : "Registrarse"}
            </Button>
            <div className="text-sm text-center text-charcoal/60">
              {isLogin
                ? "¿No tienes una cuenta? "
                : "¿Ya tienes una cuenta? "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                }}
                className="text-moss hover:text-moss/80 font-medium transition-colors"
              >
                {isLogin ? "Regístrate" : "Inicia sesión"}
              </button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
