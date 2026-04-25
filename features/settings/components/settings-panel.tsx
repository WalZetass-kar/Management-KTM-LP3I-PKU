"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Database, 
  Download, 
  Upload, 
  Activity, 
  Server,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  Loader2,
  GraduationCap
} from "lucide-react";
import type { DashboardStat } from "@/types/dashboard";
import { autoUpdateGraduationStatusAction } from "@/actions/mahasiswa";

interface SettingsPanelProps {
  stats: DashboardStat[];
  totalMahasiswa: number;
  totalJurusan: number;
  totalAngkatan: number;
}

export function SettingsPanel({ stats, totalMahasiswa, totalJurusan, totalAngkatan }: SettingsPanelProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isUpdatingGraduation, setIsUpdatingGraduation] = useState(false);
  const [importStatus, setImportStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [graduationStatus, setGraduationStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const response = await fetch("/api/export-mahasiswa");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `mahasiswa-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error exporting:", error);
      alert("Gagal export data");
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportStatus({ type: null, message: "" });

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/import-mahasiswa", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal import data");
      }

      setImportStatus({
        type: "success",
        message: `Berhasil import ${data.imported} mahasiswa!`,
      });

      // Refresh page after 2 seconds
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      setImportStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Terjadi kesalahan",
      });
    } finally {
      setIsImporting(false);
      // Reset input
      e.target.value = "";
    }
  };

  const handleDownloadTemplate = () => {
    const template = `nama,nim,jurusan,angkatan,alamat,no_hp,status
John Doe,2024010101,Teknik Informatika,2024,Jl. Contoh No. 1,08123456789,Aktif
Jane Smith,2024010102,Sistem Informasi,2024,Jl. Contoh No. 2,08123456790,Aktif`;

    const blob = new Blob([template], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "template-mahasiswa.csv";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleAutoUpdateGraduation = async () => {
    if (!window.confirm("Update otomatis status kelulusan untuk mahasiswa yang sudah 2 tahun kuliah?")) {
      return;
    }

    setIsUpdatingGraduation(true);
    setGraduationStatus({ type: null, message: "" });

    try {
      const result = await autoUpdateGraduationStatusAction();
      setGraduationStatus({
        type: result.status === "success" ? "success" : "error",
        message: result.message,
      });

      if (result.status === "success") {
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      setGraduationStatus({
        type: "error",
        message: "Terjadi kesalahan saat update status",
      });
    } finally {
      setIsUpdatingGraduation(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Pengaturan</h1>
        <p className="text-muted-foreground mt-2">
          Kelola preferensi admin, konfigurasi, dan sistem.
        </p>
      </div>

      {/* Operational Stats */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-600" />
            <CardTitle>Operasional Sistem</CardTitle>
          </div>
          <CardDescription>Status data dan operasional sistem</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Mahasiswa</p>
              <p className="text-3xl font-bold text-blue-600">{totalMahasiswa}</p>
              <p className="text-xs text-muted-foreground">KTM Di-generate: {stats[0]?.value || "0"}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Jurusan</p>
              <p className="text-3xl font-bold text-green-600">{totalJurusan}</p>
              <p className="text-xs text-green-600">● Aktif</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Angkatan</p>
              <p className="text-3xl font-bold text-purple-600">{totalAngkatan}</p>
              <p className="text-xs text-muted-foreground">Status Sistem: Online</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Backup & Export */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-600" />
            <CardTitle>Backup Database</CardTitle>
          </div>
          <CardDescription>
            Cadangkan data secara berkala untuk keamanan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div>
              <p className="font-semibold text-gray-900">Backup Terakhir</p>
              <p className="text-sm text-gray-600">
                {new Date().toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <Button onClick={handleExportCSV} disabled={isExporting}>
              {isExporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Export Data (CSV)
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Import Excel */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-green-600" />
            <CardTitle>Import Mahasiswa (Excel/CSV)</CardTitle>
          </div>
          <CardDescription>
            Upload file Excel atau CSV untuk menambahkan mahasiswa secara massal
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status Message */}
          {importStatus.type && (
            <div
              className={`p-4 rounded-lg border flex items-start gap-3 ${
                importStatus.type === "success"
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}
            >
              {importStatus.type === "success" ? (
                <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              )}
              <p className="text-sm">{importStatus.message}</p>
            </div>
          )}

          {/* Instructions */}
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800 font-semibold mb-2">
              📋 Format File:
            </p>
            <ul className="text-sm text-yellow-700 space-y-1 ml-4 list-disc">
              <li>File harus berformat .xlsx, .xls, atau .csv</li>
              <li>Kolom wajib: nama, nim, jurusan, angkatan, alamat, no_hp, status</li>
              <li>Jurusan dan angkatan harus sudah terdaftar di sistem</li>
              <li>Status: Aktif, Menunggu, Tidak Aktif, Lulus, atau Cuti</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={handleDownloadTemplate}
              className="flex-1"
            >
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Download Template
            </Button>

            <label className="flex-1">
              <Button
                className="w-full"
                disabled={isImporting}
              >
                {isImporting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload File Excel/CSV
                  </>
                )}
              </Button>
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleImportExcel}
                disabled={isImporting}
                className="hidden"
              />
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Auto Update Status Lulus */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-purple-600" />
            <CardTitle>Update Status Kelulusan Otomatis</CardTitle>
          </div>
          <CardDescription>
            Sistem otomatis mengubah status mahasiswa menjadi "Lulus" setelah 2 tahun dari angkatan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status Message */}
          {graduationStatus.type && (
            <div
              className={`p-4 rounded-lg border flex items-start gap-3 ${
                graduationStatus.type === "success"
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}
            >
              {graduationStatus.type === "success" ? (
                <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              )}
              <p className="text-sm">{graduationStatus.message}</p>
            </div>
          )}

          {/* Info */}
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="text-sm text-purple-800 font-semibold mb-2">
              🎓 Cara Kerja:
            </p>
            <ul className="text-sm text-purple-700 space-y-1 ml-4 list-disc">
              <li>Mahasiswa Angkatan 2024 → Otomatis "Lulus" di tahun 2026</li>
              <li>Mahasiswa Angkatan 2025 → Otomatis "Lulus" di tahun 2027</li>
              <li>Hanya mahasiswa dengan status "Aktif" yang akan diupdate</li>
              <li>Update berjalan otomatis saat data mahasiswa diubah</li>
            </ul>
          </div>

          {/* Action */}
          <Button
            onClick={handleAutoUpdateGraduation}
            disabled={isUpdatingGraduation}
            className="w-full"
          >
            {isUpdatingGraduation ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <GraduationCap className="mr-2 h-4 w-4" />
                Jalankan Update Status Sekarang
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* System Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Server className="h-5 w-5 text-gray-600" />
            <CardTitle>Informasi Sistem</CardTitle>
          </div>
          <CardDescription>Detail teknis dan versi sistem</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Versi</p>
              <p className="text-lg font-semibold">v1.0.0</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Database</p>
              <p className="text-lg font-semibold">PostgreSQL 15</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Framework</p>
              <p className="text-lg font-semibold">Next.js 15</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Uptime</p>
              <p className="text-lg font-semibold">99.9%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Update</p>
              <p className="text-lg font-semibold">
                {new Date().toLocaleDateString("id-ID")}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Storage</p>
              <p className="text-lg font-semibold">Supabase</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
