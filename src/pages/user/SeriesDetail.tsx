import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { MockAPI, Series, SeriesDataPoint } from "../../api/mockService";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Spinner } from "../../components/ui/Spinner";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { ArrowLeft, Edit2, Trash2, Check, X } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export const SeriesDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [series, setSeries] = useState<Series | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingPoint, setEditingPoint] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    if (id) {
      loadSeries();
    }
  }, [id]);

  const loadSeries = async () => {
    setLoading(true);
    const data = await MockAPI.getSeriesById(id!);
    if (data) {
      setSeries(data);
    }
    setLoading(false);
  };

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleEdit = (point: SeriesDataPoint) => {
    setEditingPoint(point.id);
    setEditValue(point.y.toString());
  };

  const handleSaveEdit = async (pointId: string) => {
    try {
      await MockAPI.updateDataPoint(
        series!.id,
        pointId,
        parseFloat(editValue),
        user!.id,
      );
      showNotification("success", "Punto de datos actualizado con éxito");
      setEditingPoint(null);
      loadSeries();
    } catch (error) {
      showNotification("error", "Error al actualizar el punto de datos");
    }
  };

  const handleDelete = async (pointId: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este punto?")) {
      try {
        await MockAPI.deleteDataPoint(series!.id, pointId, user!.id);
        showNotification("success", "Punto de datos eliminado con éxito");
        loadSeries();
      } catch (error) {
        showNotification("error", "Error al eliminar el punto de datos");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner className="h-8 w-8 text-moss" />
      </div>
    );
  }

  if (!series) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-serif font-bold text-charcoal">
          Serie no encontrada
        </h2>
        <Button
          onClick={() => navigate("/user")}
          variant="outline"
          className="mt-6"
        >
          Volver al Panel
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {notification && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-2xl shadow-lg z-50 ${notification.type === "success" ? "bg-moss text-white" : "bg-red-500 text-white"}`}
        >
          {notification.message}
        </div>
      )}

      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate(-1)}
          className="rounded-full bg-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-4xl font-serif font-bold tracking-tight text-charcoal">
            {series.name}
          </h1>
          <p className="text-moss font-medium mt-2 text-lg">
            Serie {series.type}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Visualización</CardTitle>
            <CardDescription>
              Gráfico de líneas interactivo de los datos de tu serie.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={series.data}
                  margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#E8E4D9"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="x"
                    stroke="#7A8B76"
                    tick={{ fill: "#7A8B76" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#7A8B76"
                    tick={{ fill: "#7A8B76" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FDFBF7",
                      borderColor: "#E8E4D9",
                      borderRadius: "16px",
                      color: "#2D2D2D",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                    itemStyle={{ color: "#7A8B76", fontWeight: 600 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="y"
                    name="Valor Calculado"
                    stroke="#7A8B76"
                    strokeWidth={3}
                    dot={{
                      fill: "#FDFBF7",
                      stroke: "#7A8B76",
                      strokeWidth: 2,
                      r: 5,
                    }}
                    activeDot={{ r: 7, fill: "#7A8B76" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="idealY"
                    name="Valor Ideal"
                    stroke="#E07A5F"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    activeDot={{ r: 5, fill: "#E07A5F" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col h-[500px] lg:h-auto">
          <CardHeader>
            <CardTitle>Puntos de Datos</CardTitle>
            <CardDescription>Gestiona términos individuales.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto pr-2">
            <div className="space-y-3">
              {series.data.map((point) => {
                const isErrorHigh =
                  point.idealY !== 0
                    ? point.error / Math.abs(point.idealY) > 0.1
                    : point.error > 0.1;

                return (
                  <div
                    key={point.id}
                    className="flex flex-col p-4 rounded-2xl bg-cream border border-beige hover:border-moss/30 transition-colors gap-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-charcoal/50 font-mono text-sm w-8">
                          x={point.x}
                        </span>
                        {editingPoint === point.id ? (
                          <Input
                            type="number"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="h-10 w-24 bg-white"
                            autoFocus
                          />
                        ) : (
                          <span className="text-charcoal font-mono font-medium">
                            {point.y.toFixed(4)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {editingPoint === point.id ? (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-10 w-10 text-moss hover:bg-moss/10"
                              onClick={() => handleSaveEdit(point.id)}
                            >
                              <Check className="h-5 w-5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-10 w-10 text-charcoal/50 hover:text-charcoal"
                              onClick={() => setEditingPoint(null)}
                            >
                              <X className="h-5 w-5" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-10 w-10 text-charcoal/50 hover:text-moss hover:bg-moss/10"
                              onClick={() => handleEdit(point)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-10 w-10 text-charcoal/50 hover:text-red-500 hover:bg-red-50"
                              onClick={() => handleDelete(point.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-xs border-t border-beige/50 pt-2">
                      <span className="text-charcoal/50">
                        Ideal: {point.idealY.toFixed(4)}
                      </span>
                      <span
                        className={`font-medium ${
                          isErrorHigh ? "text-red-500" : "text-moss"
                        }`}
                      >
                        Error: {point.error.toFixed(4)}
                      </span>
                    </div>
                  </div>
                );
              })}
              {series.data.length === 0 && (
                <div className="text-center py-8 text-charcoal/50">
                  No hay puntos de datos disponibles.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
