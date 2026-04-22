"use client";

import { useState } from "react";
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table } from "@/components/ui/table";
import { StudentStatusBadge } from "@/features/students/components/student-status-badge";
import type { MahasiswaAngkatanRecord } from "@/types/mahasiswa-angkatan";

interface MahasiswaAngkatanTableProps {
  mahasiswa: MahasiswaAngkatanRecord[];
}

export function MahasiswaAngkatanTable({ mahasiswa }: MahasiswaAngkatanTableProps) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? mahasiswa.map(m => m.id) : []);
  };

  const handleSelectOne = (id: number, checked: boolean) => {
    setSelectedIds(prev => 
      checked 
        ? [...prev, id]
        : prev.filter(selectedId => selectedId !== id)
    );
  };

  if (mahasiswa.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center">
        <div className="mx-auto max-w-sm">
          <h3 className="text-lg font-semibold text-gray-900">Belum ada data mahasiswa</h3>
          <p className="mt-2 text-sm text-gray-600">
            Mulai dengan menambahkan mahasiswa baru untuk angkatan ini.
          </p>
          <Link href="/mahasiswa-angkatan/tambah">
            <Button className="mt-4">Tambah Mahasiswa Pertama</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <thead>
          <tr>
            <th className="w-12">
              <input
                type="checkbox"
                checked={selectedIds.length === mahasiswa.length}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="rounded border-gray-300"
              />
            </th>
            <th>Nama Lengkap</th>
            <th>NIM</th>
            <th>Angkatan</th>
            <th>Jurusan</th>
            <th>Status</th>
            <th>Tanggal Dibuat</th>
            <th className="w-12"></th>
          </tr>
        </thead>
        <tbody>
          {mahasiswa.map((item) => (
            <tr key={item.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(item.id)}
                  onChange={(e) => handleSelectOne(item.id, e.target.checked)}
                  className="rounded border-gray-300"
                />
              </td>
              <td>
                <div className="flex items-center gap-3">
                  {item.photoUrl && (
                    <img
                      src={item.photoUrl}
                      alt={item.fullName}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <p className="font-medium">{item.fullName}</p>
                    <p className="text-sm text-muted-foreground">{item.phoneNumber}</p>
                  </div>
                </div>
              </td>
              <td>
                <code className="rounded bg-gray-100 px-2 py-1 text-sm">
                  {item.nim}
                </code>
              </td>
              <td>
                <Badge variant="outline">{item.angkatan}</Badge>
              </td>
              <td>{item.studyProgram}</td>
              <td>
                <StudentStatusBadge status={item.status} />
              </td>
              <td>
                <time className="text-sm text-muted-foreground">
                  {new Date(item.createdAt).toLocaleDateString("id-ID")}
                </time>
              </td>
              <td>
                <div className="flex items-center gap-1">
                  <Link href={`/mahasiswa-angkatan/${item.id}`}>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={`/mahasiswa-angkatan/${item.id}/edit`}>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}