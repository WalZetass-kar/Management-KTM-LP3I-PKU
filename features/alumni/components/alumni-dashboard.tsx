"use client";

import { GraduationCap, Briefcase, Users, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { AlumniStats, AlumniRecord } from "@/lib/alumni";

interface AlumniDashboardProps {
  stats: AlumniStats;
  alumni: AlumniRecord[];
  errorMessage?: string | null;
}

export function AlumniDashboard({ stats, alumni, errorMessage }: AlumniDashboardProps) {
  if (errorMessage) {
    return (
      <div className="p-8">
        <div className="rounded-lg bg-destructive/10 p-4 text-destructive">
          {errorMessage}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard Alumni</h1>
        <p className="text-muted-foreground">Statistik dan data alumni LP3I Pekanbaru</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-blue-100 p-3">
              <GraduationCap className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Alumni</p>
              <p className="text-2xl font-bold">{stats.totalAlumni}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-green-100 p-3">
              <Briefcase className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sudah Bekerja</p>
              <p className="text-2xl font-bold">{stats.bekerja}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-amber-100 p-3">
              <Users className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Belum Bekerja</p>
              <p className="text-2xl font-bold">{stats.belumBekerja}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-purple-100 p-3">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Lulus Tahun Ini</p>
              <p className="text-2xl font-bold">{stats.tahunIni}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Alumni List */}
      <Card className="p-6">
        <h2 className="mb-4 text-xl font-bold">Daftar Alumni</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="pb-3 text-left text-sm font-semibold">NIM</th>
                <th className="pb-3 text-left text-sm font-semibold">Nama</th>
                <th className="pb-3 text-left text-sm font-semibold">Program Studi</th>
                <th className="pb-3 text-left text-sm font-semibold">Tahun Lulus</th>
                <th className="pb-3 text-left text-sm font-semibold">Pekerjaan</th>
                <th className="pb-3 text-left text-sm font-semibold">Perusahaan</th>
              </tr>
            </thead>
            <tbody>
              {alumni.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">
                    Belum ada data alumni
                  </td>
                </tr>
              ) : (
                alumni.map((item) => (
                  <tr key={item.id} className="border-b last:border-0">
                    <td className="py-3 text-sm">{item.nim}</td>
                    <td className="py-3 text-sm font-medium">{item.fullName}</td>
                    <td className="py-3 text-sm">{item.studyProgram}</td>
                    <td className="py-3 text-sm">{item.graduationYear}</td>
                    <td className="py-3 text-sm">{item.currentJob || "-"}</td>
                    <td className="py-3 text-sm">{item.currentCompany || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
