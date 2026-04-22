"use client";

import { useState } from "react";
import { Plus, Search, Filter } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { MahasiswaAngkatanTable } from "./mahasiswa-angkatan-table";
import type { MahasiswaAngkatanRecord } from "@/types/mahasiswa-angkatan";

interface MahasiswaAngkatanDirectoryProps {
  mahasiswa: MahasiswaAngkatanRecord[];
  availableAngkatan: string[];
  currentAngkatan: string;
  searchQuery: string;
  jurusanFilter: string;
  statusFilter: string;
  errorMessage?: string | null;
}

export function MahasiswaAngkatanDirectory({
  mahasiswa,
  availableAngkatan,
  currentAngkatan,
  searchQuery,
  jurusanFilter,
  statusFilter,
  errorMessage,
}: MahasiswaAngkatanDirectoryProps) {
  const [search, setSearch] = useState(searchQuery);

  const handleAngkatanChange = (angkatan: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set("angkatan", angkatan);
    window.location.href = url.toString();
  };

  const handleSearch = () => {
    const url = new URL(window.location.href);
    if (search) {
      url.searchParams.set("search", search);
    } else {
      url.searchParams.delete("search");
    }
    window.location.href = url.toString();
  };

  const handleFilterChange = (key: string, value: string) => {
    const url = new URL(window.location.href);
    if (value) {
      url.searchParams.set(key, value);
    } else {
      url.searchParams.delete(key);
    }
    window.location.href = url.toString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mahasiswa Angkatan {currentAngkatan}</h1>
          <p className="text-muted-foreground">
            Kelola data mahasiswa berdasarkan tahun angkatan
          </p>
        </div>
        <Link href="/mahasiswa-angkatan/tambah">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Tambah Mahasiswa
          </Button>
        </Link>
      </div>

      {errorMessage && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari berdasarkan nama atau NIM..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <Select
            value={currentAngkatan}
            onChange={(e) => handleAngkatanChange(e.target.value)}
            options={availableAngkatan.map(angkatan => ({
              label: `Angkatan ${angkatan}`,
              value: angkatan
            }))}
            placeholder="Pilih Angkatan"
          />

          <Button onClick={handleSearch} variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      {/* Table */}
      <MahasiswaAngkatanTable mahasiswa={mahasiswa} />
    </div>
  );
}