"use client";

import { User, MapPin, Phone, Calendar } from "lucide-react";
import QRCode from "qrcode";
import { useEffect, useState } from "react";

interface MahasiswaData {
  id: number;
  nama: string;
  nim: string;
  jurusan: string;
  alamat: string;
  no_hp: string;
  foto_url: string | null;
  status: string;
  created_at: string;
}

interface KtmPreviewCardProps {
  mahasiswa: MahasiswaData;
}

export function KtmPreviewCard({ mahasiswa }: KtmPreviewCardProps) {
  const [qrCode, setQrCode] = useState<string>("");

  useEffect(() => {
    // Generate QR Code
    QRCode.toDataURL(mahasiswa.nim, {
      width: 200,
      margin: 1,
      color: {
        dark: "#1e3a8a",
        light: "#ffffff",
      },
    })
      .then((url) => setQrCode(url))
      .catch((err) => console.error("Error generating QR code:", err));
  }, [mahasiswa.nim]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="rounded-3xl bg-white p-6 shadow-2xl">
        <h3 className="text-lg font-semibold text-gray-900">
          Kartu Tanda Mahasiswa
        </h3>
        <p className="mt-1 text-sm text-gray-600">
          Politeknik LP3I Pekanbaru
        </p>

        {/* KTM Card */}
        <div className="mt-6 overflow-hidden rounded-2xl border-2 border-blue-900 bg-gradient-to-br from-blue-50 to-white shadow-lg">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wider text-blue-100">
                  Politeknik LP3I
                </h4>
                <p className="mt-1 text-xl font-bold text-white">
                  Kartu Mahasiswa
                </p>
              </div>
              <div className="rounded-lg bg-white/20 px-3 py-1.5 backdrop-blur-sm">
                <p className="text-xs font-semibold text-white">
                  {mahasiswa.status}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex gap-6">
              {/* Photo */}
              <div className="shrink-0">
                {mahasiswa.foto_url ? (
                  <img
                    src={mahasiswa.foto_url}
                    alt={mahasiswa.nama}
                    className="h-32 w-32 rounded-xl border-2 border-blue-200 object-cover shadow-md"
                  />
                ) : (
                  <div className="flex h-32 w-32 items-center justify-center rounded-xl border-2 border-blue-200 bg-blue-50 shadow-md">
                    <User className="h-16 w-16 text-blue-300" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 space-y-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Nama Lengkap
                  </p>
                  <p className="mt-1 text-lg font-bold text-gray-900">
                    {mahasiswa.nama}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    NIM
                  </p>
                  <p className="mt-1 text-base font-semibold text-blue-900">
                    {mahasiswa.nim}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Program Studi
                  </p>
                  <p className="mt-1 text-base font-medium text-gray-700">
                    {mahasiswa.jurusan}
                  </p>
                </div>
              </div>

              {/* QR Code */}
              {qrCode && (
                <div className="shrink-0">
                  <div className="rounded-xl border-2 border-blue-200 bg-white p-2 shadow-md">
                    <img
                      src={qrCode}
                      alt="QR Code"
                      className="h-24 w-24"
                    />
                  </div>
                  <p className="mt-2 text-center text-xs text-gray-500">
                    Scan QR
                  </p>
                </div>
              )}
            </div>

            {/* Additional Info */}
            <div className="mt-6 grid gap-3 border-t border-gray-200 pt-4 sm:grid-cols-2">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Alamat</p>
                  <p className="text-sm text-gray-700">{mahasiswa.alamat}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">No. HP</p>
                  <p className="text-sm text-gray-700">{mahasiswa.no_hp}</p>
                </div>
              </div>

              <div className="flex items-start gap-2 sm:col-span-2">
                <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Terdaftar Sejak</p>
                  <p className="text-sm text-gray-700">
                    {new Date(mahasiswa.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-3">
            <p className="text-center text-xs text-gray-500">
              Kartu ini adalah bukti identitas resmi mahasiswa Politeknik LP3I Pekanbaru
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
