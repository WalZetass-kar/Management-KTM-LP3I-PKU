"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import type { JurusanChartData } from "@/types/dashboard";

interface JurusanChartProps {
  data: JurusanChartData[];
  availableYears: number[];
  currentYear: number;
}

// Warna sesuai permintaan
const JURUSAN_COLORS: Record<string, string> = {
  "Hubungan Masyarakat": "#ef4444", // Merah
  "Administrasi Bisnis": "#3b82f6", // Biru
  "Management Informatika": "#22c55e", // Hijau
  "Komputerisasi Akuntansi": "#eab308", // Kuning
};

const getJurusanColor = (jurusan: string) => {
  return JURUSAN_COLORS[jurusan] || "#6b7280"; // Default abu-abu
};

export function JurusanChart({ data, availableYears, currentYear }: JurusanChartProps) {
  const [selectedYear, setSelectedYear] = useState(String(currentYear));

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    // Reload page dengan query param tahun
    window.location.href = `/dashboard?year=${year}`;
  };

  // Transform data untuk recharts dengan warna
  const chartData = data.map((item) => ({
    name: item.jurusan,
    mahasiswa: item.count,
    fill: getJurusanColor(item.jurusan),
  }));

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-bold text-foreground">Mahasiswa per Jurusan</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Distribusi mahasiswa berdasarkan program studi tahun {selectedYear}
            </p>
          </div>
          <div className="w-full sm:w-40">
            <Select
              value={selectedYear}
              onChange={(e) => handleYearChange(e.target.value)}
              options={availableYears.map((year) => ({
                label: String(year),
                value: String(year),
              }))}
            />
          </div>
        </div>

        {chartData.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-muted-foreground">
            Tidak ada data mahasiswa untuk tahun {selectedYear}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fill: "#6b7280", fontSize: 12 }}
              />
              <YAxis
                tick={{ fill: "#6b7280", fontSize: 12 }}
                label={{
                  value: "Jumlah Mahasiswa",
                  angle: -90,
                  position: "insideLeft",
                  style: { fill: "#6b7280", fontSize: 12 },
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  padding: "8px 12px",
                }}
                labelStyle={{ color: "#1f2937", fontWeight: 600 }}
                itemStyle={{ color: "#6b7280" }}
              />
              <Legend
                wrapperStyle={{ paddingTop: "20px" }}
                iconType="circle"
                formatter={(value) => (
                  <span style={{ color: "#6b7280", fontSize: "12px" }}>
                    {value}
                  </span>
                )}
              />
              <Bar
                dataKey="mahasiswa"
                name="Jumlah Mahasiswa"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}

        {/* Legend Manual dengan Warna */}
        <div className="mt-6 grid grid-cols-2 gap-3 border-t pt-4 sm:grid-cols-4">
          {Object.entries(JURUSAN_COLORS).map(([jurusan, color]) => (
            <div key={jurusan} className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs text-muted-foreground">{jurusan}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
