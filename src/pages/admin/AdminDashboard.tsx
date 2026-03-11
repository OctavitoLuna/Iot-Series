import React, { useEffect, useState } from "react";
import { MockAPI } from "../../api/mockService";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Spinner } from "../../components/ui/Spinner";
import { Users, Activity, Database } from "lucide-react";

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    seriesCreatedToday: 0,
    recentChanges: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    MockAPI.getStats().then((data) => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner className="h-8 w-8 text-moss" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-serif font-bold tracking-tight text-charcoal">
          Panel de Administración
        </h1>
        <p className="text-charcoal/60 mt-2 text-lg">
          Visión general global de la plataforma IoT Math.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-charcoal/60 font-sans">
              Usuarios Totales
            </CardTitle>
            <div className="p-2 bg-moss/10 rounded-xl text-moss">
              <Users className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-serif font-bold text-charcoal">
              {stats.totalUsers}
            </div>
            <p className="text-sm text-charcoal/50 mt-2">Cuentas registradas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-charcoal/60 font-sans">
              Series Creadas Hoy
            </CardTitle>
            <div className="p-2 bg-terracotta/10 rounded-xl text-terracotta">
              <Database className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-serif font-bold text-charcoal">
              {stats.seriesCreatedToday}
            </div>
            <p className="text-sm text-charcoal/50 mt-2">De todos los usuarios</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-charcoal/60 font-sans">
              Cambios Recientes
            </CardTitle>
            <div className="p-2 bg-sand/30 rounded-xl text-charcoal/70">
              <Activity className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-serif font-bold text-charcoal">
              {stats.recentChanges}
            </div>
            <p className="text-sm text-charcoal/50 mt-2">Entradas del registro de auditoría</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
