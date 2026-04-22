import { JurusanTable } from "@/features/jurusan/components/jurusan-table";
import { getJurusanList } from "@/lib/jurusan";

interface JurusanPageProps {
  searchParams: Promise<{
    status?: string;
  }>;
}

export default async function JurusanPage({ searchParams }: JurusanPageProps) {
  const [{ data, error }, resolvedSearchParams] = await Promise.all([
    getJurusanList(),
    searchParams,
  ]);

  const noticeMessage =
    resolvedSearchParams.status === "created"
      ? "Jurusan baru berhasil ditambahkan."
      : resolvedSearchParams.status === "updated"
      ? "Data jurusan berhasil diperbarui."
      : null;

  return (
    <JurusanTable
      jurusanList={data}
      errorMessage={error}
      noticeMessage={noticeMessage}
    />
  );
}
