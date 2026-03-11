import React, { useEffect, useState } from "react";
import { MockAPI, AuditLog } from "../../api/mockService";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Spinner } from "../../components/ui/Spinner";
import { Activity, Clock, User, FileText } from "lucide-react";

export const AuditLogs = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    MockAPI.getAuditLogs().then((data) => {
      setLogs(data);
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
          Registros de Auditoría
        </h1>
        <p className="text-charcoal/60 mt-2 text-lg">
          Rastrea la actividad del usuario y los eventos del sistema.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-moss" />
            Actividad Reciente
          </CardTitle>
          <CardDescription>
            Lista cronológica de todas las acciones realizadas en el sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-cream border border-beige hover:border-moss/30 transition-colors"
              >
                <div className="flex-shrink-0 mt-1">
                  <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center border border-beige shadow-sm">
                    <FileText className="h-5 w-5 text-moss/70" />
                  </div>
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <p className="text-sm font-medium text-charcoal">
                      <span className="text-moss font-semibold">
                        {log.fullName}
                      </span>{" "}
                      {log.details}
                    </p>
                    <div className="flex items-center text-xs text-charcoal/50 gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(log.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-charcoal/50">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      ID: {log.userId.substring(0, 8)}...
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-white border border-beige text-charcoal/60 font-mono shadow-sm">
                      {log.action}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {logs.length === 0 && (
              <div className="text-center py-12 text-charcoal/50">
                No se encontraron registros de actividad.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
