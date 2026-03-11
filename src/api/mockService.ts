import { evaluate, derivative } from 'mathjs';

export interface SeriesDataPoint {
  id: string;
  x: number;
  y: number;
  idealY: number;
  error: number;
}

export interface Series {
  id: string;
  name: string;
  type: "Fibonacci" | "Taylor" | "Maclaurin";
  params: any;
  data: SeriesDataPoint[];
  createdAt: string;
  userId: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: "Admin" | "User";
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  userId: string;
  fullName: string;
  details: string;
}

// Mock Database
let mockUsers: User[] = [
  {
    id: "1",
    email: "marco@gmail.com",
    fullName: "octavio luna",
    role: "Admin",
  },
  {
    id: "2",
    email: "leo@gmail.com",
    fullName: "leo ibarra",
    role: "User",
  },
];

let mockSeries: Series[] = [
  {
    id: "s1",
    name: "My Fibo",
    type: "Fibonacci",
    params: { terms: 5, a: 0, b: 1, noise: 0 },
    data: [
      { id: "p1", x: 1, y: 0, idealY: 0, error: 0 },
      { id: "p2", x: 2, y: 1, idealY: 1, error: 0 },
      { id: "p3", x: 3, y: 1, idealY: 1, error: 0 },
      { id: "p4", x: 4, y: 2, idealY: 2, error: 0 },
      { id: "p5", x: 5, y: 3, idealY: 3, error: 0 },
    ],
    createdAt: new Date().toISOString(),
    userId: "2",
  },
];

let mockLogs: AuditLog[] = [
  {
    id: "l1",
    timestamp: new Date().toISOString(),
    action: "CREATE_SERIES",
    userId: "2",
    fullName: "leo ibarra",
    details: 'Serie "My Fibo" creada',
  },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const MockAPI = {
  login: async (email: string, password?: string): Promise<User> => {
    await delay(800);
    const user = mockUsers.find((u) => u.email === email);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
    return user;
  },

  signup: async (
    email: string,
    fullName: string,
    password?: string,
  ): Promise<User> => {
    await delay(800);
    if (mockUsers.find((u) => u.email === email)) {
      throw new Error("El usuario ya existe");
    }
    const newUser: User = {
      id: Math.random().toString(36).substring(7),
      email,
      fullName,
      role: email === "marco@gmail.com" ? "Admin" : "User",
    };
    mockUsers.push(newUser);
    return newUser;
  },

  getUserSeries: async (userId: string): Promise<Series[]> => {
    await delay(500);
    return mockSeries.filter((s) => s.userId === userId);
  },

  getAllSeries: async (): Promise<Series[]> => {
    await delay(500);
    return mockSeries;
  },

  getSeriesById: async (id: string): Promise<Series | undefined> => {
    await delay(300);
    return mockSeries.find((s) => s.id === id);
  },

  createSeries: async (
    seriesData: Omit<Series, "id" | "createdAt" | "data">,
  ): Promise<Series> => {
    await delay(800);
    
    let data: SeriesDataPoint[] = [];
    
    if (seriesData.type === "Fibonacci") {
      let a = seriesData.params.a || 0;
      let b = seriesData.params.b || 1;
      let terms = seriesData.params.terms || 10;
      let noise = seriesData.params.noise || 0;
      
      let currentA = a;
      let currentB = b;
      
      for (let i = 1; i <= terms; i++) {
        let idealY = currentA;
        let y = idealY + (Math.random() * 2 - 1) * noise;
        data.push({
          id: Math.random().toString(36).substring(7),
          x: i,
          y: y,
          idealY: idealY,
          error: Math.abs(y - idealY)
        });
        
        let next = currentA + currentB;
        currentA = currentB;
        currentB = next;
      }
    } else {
      let func = seriesData.params.function || "sin(x)";
      let evalX = seriesData.params.x || 1;
      let n = seriesData.params.n || 5;
      let centerA = seriesData.type === "Maclaurin" ? 0 : (seriesData.params.a || 0);
      
      let idealY = 0;
      try {
        idealY = evaluate(func, { x: evalX });
      } catch (e) {
        idealY = 0;
      }
      
      let currentExpr = func;
      let currentSum = 0;
      let factorial = 1;
      
      for (let k = 0; k <= n; k++) {
        let derivVal = 0;
        try {
          if (k === 0) {
            derivVal = evaluate(currentExpr, { x: centerA });
          } else {
            currentExpr = derivative(currentExpr, 'x').toString();
            derivVal = evaluate(currentExpr, { x: centerA });
            factorial *= k;
          }
        } catch (e) {
          derivVal = 0;
        }
        
        let term = (derivVal / factorial) * Math.pow(evalX - centerA, k);
        currentSum += term;
        
        data.push({
          id: Math.random().toString(36).substring(7),
          x: k,
          y: currentSum,
          idealY: idealY,
          error: Math.abs(currentSum - idealY)
        });
      }
    }

    const newSeries: Series = {
      ...seriesData,
      id: Math.random().toString(36).substring(7),
      createdAt: new Date().toISOString(),
      data: data,
    };
    mockSeries.push(newSeries);
    mockLogs.unshift({
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toISOString(),
      action: "CREATE_SERIES",
      userId: seriesData.userId,
      fullName:
        mockUsers.find((u) => u.id === seriesData.userId)?.fullName ||
        "Desconocido",
      details: `Serie "${newSeries.name}" creada`,
    });
    return newSeries;
  },

  updateDataPoint: async (
    seriesId: string,
    pointId: string,
    newValue: number,
    userId: string,
  ): Promise<void> => {
    await delay(500);
    const series = mockSeries.find((s) => s.id === seriesId);
    if (series) {
      const point = series.data.find((p) => p.id === pointId);
      if (point) {
        point.y = newValue;
        point.error = Math.abs(point.y - point.idealY);
        mockLogs.unshift({
          id: Math.random().toString(36).substring(7),
          timestamp: new Date().toISOString(),
          action: "UPDATE_POINT",
          userId,
          fullName:
            mockUsers.find((u) => u.id === userId)?.fullName || "Desconocido",
          details: `Término ${point.x} de la serie "${series.name}" modificado`,
        });
      }
    }
  },

  deleteDataPoint: async (
    seriesId: string,
    pointId: string,
    userId: string,
  ): Promise<void> => {
    await delay(500);
    const series = mockSeries.find((s) => s.id === seriesId);
    if (series) {
      const pointIndex = series.data.findIndex((p) => p.id === pointId);
      if (pointIndex > -1) {
        const point = series.data[pointIndex];
        series.data.splice(pointIndex, 1);
        mockLogs.unshift({
          id: Math.random().toString(36).substring(7),
          timestamp: new Date().toISOString(),
          action: "DELETE_POINT",
          userId,
          fullName:
            mockUsers.find((u) => u.id === userId)?.fullName || "Desconocido",
          details: `Término ${point.x} de la serie "${series.name}" eliminado`,
        });
      }
    }
  },

  getAuditLogs: async (): Promise<AuditLog[]> => {
    await delay(500);
    return mockLogs;
  },

  getUsers: async (): Promise<User[]> => {
    await delay(500);
    return mockUsers;
  },

  getStats: async () => {
    await delay(500);
    return {
      totalUsers: mockUsers.length,
      seriesCreatedToday: mockSeries.filter(
        (s) =>
          new Date(s.createdAt).toDateString() === new Date().toDateString(),
      ).length,
      recentChanges: mockLogs.length,
    };
  },
};
