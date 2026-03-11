import React, { useEffect, useState } from "react";
import { MockAPI, Series, User } from "../../api/mockService";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Spinner } from "../../components/ui/Spinner";
import { Search, Filter } from "lucide-react";

export const DatabaseExplorer = () => {
  const [series, setSeries] = useState<(Series & { user?: User })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("All");

  useEffect(() => {
    const fetchData = async () => {
      const allSeries = await MockAPI.getAllSeries();
      const users = await MockAPI.getUsers();

      const enrichedSeries = allSeries.map((s) => ({
        ...s,
        user: users.find((u) => u.id === s.userId),
      }));

      setSeries(enrichedSeries);
      setLoading(false);
    };

    fetchData();
  }, []);

  const filteredSeries = series.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.user?.fullName &&
        s.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === "All" || s.type === typeFilter;
    return matchesSearch && matchesType;
  });

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
          Explorador de Base de Datos
        </h1>
        <p className="text-charcoal/60 mt-2 text-lg">
          Ve y filtra todas las series creadas por los usuarios.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div>
              <CardTitle>Todas las Series</CardTitle>
              <CardDescription>
                Mostrando {filteredSeries.length} resultados
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal/40" />
                <Input
                  placeholder="Buscar nombre o usuario..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white"
                />
              </div>
              <div className="relative w-full sm:w-48">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal/40" />
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="flex h-12 w-full rounded-2xl border border-charcoal/20 bg-white/50 pl-10 pr-4 py-2 text-sm text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal/30 focus-visible:border-charcoal/50 transition-all appearance-none"
                >
                  <option value="All">Todos los Tipos</option>
                  <option value="Fibonacci">Fibonacci</option>
                  <option value="Taylor">Taylor</option>
                  <option value="Maclaurin">Maclaurin</option>
                </select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-charcoal/60 uppercase bg-cream border-y border-beige">
                <tr>
                  <th className="px-6 py-4 font-medium tracking-wider">
                    Nombre de la Serie
                  </th>
                  <th className="px-6 py-4 font-medium tracking-wider">Tipo</th>
                  <th className="px-6 py-4 font-medium tracking-wider">Usuario</th>
                  <th className="px-6 py-4 font-medium tracking-wider">
                    Puntos de Datos
                  </th>
                  <th className="px-6 py-4 font-medium tracking-wider">
                    Error Promedio
                  </th>
                  <th className="px-6 py-4 font-medium tracking-wider">
                    Creado El
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredSeries.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b border-beige hover:bg-cream/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-charcoal">
                      {s.name}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-moss/10 text-moss">
                        {s.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-charcoal/80">
                      {s.user?.fullName || "Desconocido"}
                    </td>
                    <td className="px-6 py-4 font-mono text-charcoal/80">
                      {s.data.length}
                    </td>
                    <td className="px-6 py-4 font-mono">
                      <span
                        className={
                          s.data.length > 0 &&
                          s.data.reduce((acc, p) => acc + p.error, 0) /
                            s.data.length >
                            0.1
                            ? "text-red-500 font-medium"
                            : "text-moss font-medium"
                        }
                      >
                        {s.data.length > 0
                          ? (
                              s.data.reduce((acc, p) => acc + p.error, 0) /
                              s.data.length
                            ).toFixed(4)
                          : "0.0000"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-charcoal/60">
                      {new Date(s.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
                {filteredSeries.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-charcoal/50"
                    >
                      No se encontraron series que coincidan con tus filtros.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
