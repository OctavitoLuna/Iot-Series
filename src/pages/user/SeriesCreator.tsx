import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { MockAPI } from "../../api/mockService";
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
import { Loader2, ArrowLeft } from "lucide-react";

export const SeriesCreator = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState<"Fibonacci" | "Taylor" | "Maclaurin">(
    "Fibonacci",
  );
  const [params, setParams] = useState<any>({
    terms: 10,
    a: 0,
    b: 1,
    noise: 0,
  });

  const handleTypeChange = (newType: "Fibonacci" | "Taylor" | "Maclaurin") => {
    setType(newType);
    if (newType === "Fibonacci") {
      setParams({ terms: 10, a: 0, b: 1, noise: 0 });
    } else {
      setParams({
        function: "sin(x)",
        x: 1,
        n: 5,
        a: newType === "Maclaurin" ? 0 : 1,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("El nombre es obligatorio");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const newSeries = await MockAPI.createSeries({
        name,
        type,
        params,
        userId: user!.id,
      });
      navigate(`/user/series/${newSeries.id}`);
    } catch (err) {
      setError("Error al crear la serie");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-10">
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
            Crear Serie
          </h1>
          <p className="text-charcoal/60 mt-2 text-lg">
            Configura los parámetros para tu nueva serie matemática.
          </p>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Configuración de la Serie</CardTitle>
            <CardDescription>
              Selecciona el tipo y establece los parámetros.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-3">
              <label className="text-sm font-medium text-charcoal/80">
                Nombre
              </label>
              <Input
                placeholder="Mi Serie Increíble"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-charcoal/80">
                Tipo
              </label>
              <select
                value={type}
                onChange={(e) => handleTypeChange(e.target.value as any)}
                className="flex h-12 w-full rounded-2xl border border-charcoal/20 bg-white/50 px-4 py-2 text-sm text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal/30 focus-visible:border-charcoal/50 transition-all"
              >
                <option value="Fibonacci">Fibonacci</option>
                <option value="Taylor">Taylor</option>
                <option value="Maclaurin">Maclaurin</option>
              </select>
            </div>

            <div className="p-6 rounded-[20px] bg-cream border border-beige space-y-6">
              <h3 className="text-sm font-medium text-moss uppercase tracking-wider">
                Parámetros
              </h3>

              {type === "Fibonacci" ? (
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-sm text-charcoal/60">
                      Términos (n)
                    </label>
                    <Input
                      type="number"
                      value={params.terms}
                      onChange={(e) =>
                        setParams({
                          ...params,
                          terms: parseInt(e.target.value),
                        })
                      }
                      className="bg-white"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm text-charcoal/60">
                      a Inicial
                    </label>
                    <Input
                      type="number"
                      value={params.a}
                      onChange={(e) =>
                        setParams({ ...params, a: parseInt(e.target.value) })
                      }
                      className="bg-white"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm text-charcoal/60">
                      b Inicial
                    </label>
                    <Input
                      type="number"
                      value={params.b}
                      onChange={(e) =>
                        setParams({ ...params, b: parseInt(e.target.value) })
                      }
                      className="bg-white"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm text-charcoal/60">
                      Nivel de Ruido
                    </label>
                    <Input
                      type="number"
                      step="0.1"
                      value={params.noise}
                      onChange={(e) =>
                        setParams({
                          ...params,
                          noise: parseFloat(e.target.value),
                        })
                      }
                      className="bg-white"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3 col-span-2">
                    <label className="text-sm text-charcoal/60">
                      Función f(x)
                    </label>
                    <Input
                      type="text"
                      value={params.function}
                      onChange={(e) =>
                        setParams({ ...params, function: e.target.value })
                      }
                      className="bg-white"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm text-charcoal/60">
                      Evaluar en x
                    </label>
                    <Input
                      type="number"
                      step="0.1"
                      value={params.x}
                      onChange={(e) =>
                        setParams({ ...params, x: parseFloat(e.target.value) })
                      }
                      className="bg-white"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm text-charcoal/60">
                      Grado (n)
                    </label>
                    <Input
                      type="number"
                      value={params.n}
                      onChange={(e) =>
                        setParams({ ...params, n: parseInt(e.target.value) })
                      }
                      className="bg-white"
                    />
                  </div>
                  {type === "Taylor" && (
                    <div className="space-y-3">
                      <label className="text-sm text-charcoal/60">
                        Centro (a)
                      </label>
                      <Input
                        type="number"
                        step="0.1"
                        value={params.a}
                        onChange={(e) =>
                          setParams({
                            ...params,
                            a: parseFloat(e.target.value),
                          })
                        }
                        className="bg-white"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {error && (
              <p className="text-sm text-red-500 font-medium">{error}</p>
            )}
          </CardContent>
          <CardFooter className="border-t border-beige pt-8">
            <Button
              type="submit"
              className="w-full"
              variant="moss"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generar Serie
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
