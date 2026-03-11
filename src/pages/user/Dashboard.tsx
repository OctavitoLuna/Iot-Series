import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { MockAPI, Series } from "../../api/mockService";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Spinner } from "../../components/ui/Spinner";
import { useNavigate } from "react-router-dom";
import {
  ActivitySquare,
  PlusCircle,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { Button } from "../../components/ui/Button";

export const Dashboard = () => {
  const { user } = useAuth();
  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      MockAPI.getUserSeries(user.id).then((data) => {
        setSeries(data);
        setLoading(false);
      });
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner className="h-8 w-8 text-moss" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-serif font-bold tracking-tight text-charcoal">
            Mis Series
          </h1>
          <p className="text-charcoal/60 mt-2 text-lg">
            Gestiona y visualiza tus series matemáticas.
          </p>
        </div>
        <Button onClick={() => navigate("/user/create")} variant="moss">
          <PlusCircle className="mr-2 h-5 w-5" />
          Crear Nueva Serie
        </Button>
      </div>

      {series.length === 0 ? (
        <Card className="border-dashed border-2 border-beige bg-transparent flex flex-col items-center justify-center py-16 shadow-none">
          <ActivitySquare className="h-16 w-16 text-beige mb-6" />
          <CardTitle className="text-2xl text-charcoal">
            No se encontraron series
          </CardTitle>
          <CardDescription className="text-charcoal/60 mt-2 text-base">
            Empieza creando tu primera serie matemática.
          </CardDescription>
          <Button
            onClick={() => navigate("/user/create")}
            variant="outline"
            className="mt-8"
          >
            Crear Serie
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
          {/* Bento Grid Layout */}
          {series.map((s, index) => (
            <Card
              key={s.id}
              className={`cursor-pointer group hover:shadow-md transition-all duration-300 hover:-translate-y-1 ${
                index === 0
                  ? "md:col-span-2 lg:col-span-2 bg-moss/5 border-moss/20"
                  : "bg-white"
              }`}
              onClick={() => navigate(`/user/series/${s.id}`)}
            >
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <CardTitle className="text-xl text-charcoal group-hover:text-moss transition-colors">
                      {s.name}
                    </CardTitle>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-terracotta/10 text-terracotta">
                      {s.type}
                    </span>
                  </div>
                  <div className="p-3 bg-white rounded-2xl shadow-sm border border-beige group-hover:bg-moss group-hover:text-white transition-colors text-charcoal/40">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-end pt-6">
                  <div className="flex gap-8">
                    <div>
                      <p className="text-3xl font-serif font-bold text-charcoal">
                        {s.data.length}
                      </p>
                      <p className="text-sm text-charcoal/50 mt-1">Puntos de Datos</p>
                    </div>
                    <div>
                      <p className="text-3xl font-serif font-bold text-charcoal">
                        {s.data.length > 0
                          ? (
                              s.data.reduce((acc, p) => acc + p.error, 0) /
                              s.data.length
                            ).toFixed(4)
                          : "0.0000"}
                      </p>
                      <p className="text-sm text-charcoal/50 mt-1">Error Promedio</p>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-moss font-medium opacity-0 group-hover:opacity-100 transition-opacity -translate-x-4 group-hover:translate-x-0 duration-300">
                    Ver Detalles <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
