import type { StudentRecord } from "@/types/student";

function formatCardPeriod(createdAt: string, yearOffset = 0) {
  const baseDate = new Date(createdAt);
  const safeDate = Number.isNaN(baseDate.getTime()) ? new Date() : baseDate;
  const nextDate = new Date(safeDate);

  nextDate.setFullYear(nextDate.getFullYear() + yearOffset);

  const month = String(nextDate.getMonth() + 1).padStart(2, "0");
  const year = String(nextDate.getFullYear()).slice(-2);

  return `${month}/${year}`;
}

export function KtmCardPreview({ student }: { student: StudentRecord | null }) {
  if (!student) {
    return (
      <div className="flex min-h-[32rem] items-center justify-center rounded-[2rem] border border-dashed border-border bg-slate-50 p-8 text-center">
        <div className="w-full max-w-[760px] rounded-[2rem] border border-border/80 bg-white p-6 shadow-sm">
          <div className="aspect-[1.58/1] overflow-hidden rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(140deg,#f8fafc,#eef4ff)]">
            <div className="relative flex h-full items-center justify-center px-8">
              <div className="absolute inset-x-0 top-0 h-[4.5rem] bg-[#0d4a7d]" />
              <div className="absolute right-0 top-0 h-[4.5rem] w-44 rounded-bl-[2.25rem] bg-[#f7b62d]" />
              <div className="absolute bottom-0 right-0 h-16 w-52 rounded-tl-[3rem] bg-[#0d4a7d]" />
              <div className="absolute bottom-0 left-0 h-14 w-28 rounded-tr-[2.5rem] bg-[#f7b62d]" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                  Preview KTM
                </p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Pilih mahasiswa untuk melihat desain kartu dengan format landscape seperti contoh.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const validFrom = formatCardPeriod(student.createdAt);
  const validUntil = formatCardPeriod(student.createdAt, 2);

  return (
    <div className="flex min-h-[32rem] items-center justify-center rounded-[2rem] bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.9),_rgba(219,234,254,0.65)_42%,_rgba(191,219,254,0.85)_100%)] p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-[780px] rounded-[2.25rem] border border-white/80 bg-white/70 p-3 shadow-[0_30px_80px_rgba(15,23,42,0.16)] backdrop-blur-sm">
        <div className="relative aspect-[1.58/1] overflow-hidden rounded-[1.9rem] border border-slate-200 bg-[#fbfbfb] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
          <div className="absolute inset-x-0 top-0 h-[22%] bg-[#0d4a7d]" />
          <div className="absolute left-[58%] top-0 h-[22%] w-[23%] rounded-bl-[3rem] bg-[#f7f7f7]" />
          <div className="absolute right-0 top-0 h-[24%] w-[19%] rounded-bl-[3.5rem] bg-[#f7b62d]" />
          <div className="absolute bottom-0 right-0 h-[15%] w-[28%] rounded-tl-[3.5rem] bg-[#0d4a7d]" />
          <div className="absolute bottom-0 left-0 h-[13%] w-[18%] rounded-tr-[4rem] bg-[#f7b62d]" />
          <div className="absolute left-[4%] top-[40%] h-[48%] w-[26%] bg-[linear-gradient(180deg,rgba(214,226,239,0.55),rgba(214,226,239,0.06))] [clip-path:polygon(6%_10%,25%_0,47%_18%,58%_0,77%_14%,100%_0,100%_100%,0_100%)] opacity-60" />
          <div className="absolute right-[3%] top-[22%] h-[68%] w-[30%] opacity-65">
            <svg viewBox="0 0 300 300" className="h-full w-full">
              <g fill="none" stroke="#92d3dd" strokeWidth="1.5">
                <circle cx="210" cy="150" r="115" />
                <path d="M110 150c26-42 63-68 100-68s74 26 100 68c-26 42-63 68-100 68s-74-26-100-68Z" />
                <path d="M133 90c31 18 56 52 68 96-12 44-37 78-68 96" />
                <path d="M287 90c-31 18-56 52-68 96 12 44 37 78 68 96" />
                <path d="M120 114h180" />
                <path d="M105 150h210" />
                <path d="M120 186h180" />
              </g>
            </svg>
          </div>

          <div className="relative z-10 flex h-full flex-col">
            <div className="flex items-start justify-between px-[4%] pb-[3%] pt-[2.7%] text-white">
              <div className="flex items-start gap-3">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-white/35 bg-white/10 text-2xl font-black tracking-tight">
                  LP
                </div>
                <div>
                  <p className="text-[clamp(0.9rem,1.4vw,1.15rem)] font-extrabold uppercase tracking-[0.18em]">
                    Student ID Card
                  </p>
                  <p className="mt-1 text-[clamp(0.5rem,1.05vw,0.78rem)] font-medium uppercase tracking-[0.12em] text-blue-100">
                    Politeknik LP3I Pekanbaru
                  </p>
                </div>
              </div>
            </div>

            <div className="grid flex-1 grid-cols-[31%_1fr] gap-[5%] px-[4.4%] pb-[4.5%] pt-[5.5%]">
              <div className="flex flex-col justify-center">
                <div className="overflow-hidden rounded-[1.2rem] border-[3px] border-[#124b7f] bg-[#14a1aa] shadow-[0_16px_32px_rgba(15,23,42,0.12)]">
                  {student.photoUrl ? (
                    <img
                      src={student.photoUrl}
                      alt={student.fullName}
                      className="aspect-[3/4] w-full object-cover"
                    />
                  ) : (
                    <div className="flex aspect-[3/4] items-center justify-center bg-[linear-gradient(160deg,#0ea5b7,#1d4ed8)] text-6xl font-bold text-white">
                      {student.fullName.slice(0, 1)}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex min-w-0 flex-col justify-between">
                <div>
                  <div className="flex items-start gap-4 text-[#0d4a7d]">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-[#0d4a7d]/15 bg-white text-3xl font-black tracking-tight shadow-sm">
                      LP
                    </div>
                    <div className="border-l border-[#0d4a7d]/25 pl-4">
                      <p className="text-[clamp(0.9rem,1.45vw,1.24rem)] font-black uppercase leading-none">
                        Politeknik LP3I
                      </p>
                      <p className="mt-1 text-[clamp(0.85rem,1.3vw,1.1rem)] font-black uppercase leading-none">
                        Kampus Pekanbaru
                      </p>
                    </div>
                  </div>

                  <div className="mt-[10%]">
                    <p className="text-[clamp(0.7rem,1.1vw,0.9rem)] font-semibold uppercase tracking-[0.16em] text-[#11a4ad]">
                      NIM :
                    </p>
                    <p className="mt-1 text-[clamp(1.45rem,3vw,2.6rem)] font-black leading-none tracking-tight text-[#0d2f4f]">
                      {student.nim}
                    </p>
                  </div>

                  <div className="mt-[15%] max-w-[92%]">
                    <p className="text-[clamp(1.5rem,3.65vw,3.1rem)] font-black uppercase leading-[0.92] tracking-tight text-[#082f57]">
                      {student.fullName}
                    </p>
                    <p className="mt-3 text-[clamp(1rem,1.9vw,1.7rem)] font-semibold uppercase tracking-[0.08em] text-[#ef4444]">
                      {student.studyProgram}
                    </p>
                  </div>
                </div>

                <div className="flex items-end gap-[9%]">
                  <div>
                    <p className="text-[clamp(0.66rem,1vw,0.85rem)] font-semibold uppercase leading-none tracking-[0.12em] text-[#11a4ad]">
                      Berlaku
                    </p>
                    <p className="text-[clamp(0.66rem,1vw,0.85rem)] font-semibold uppercase leading-none tracking-[0.12em] text-[#11a4ad]">
                      Sejak
                    </p>
                    <p className="mt-1 text-[clamp(1.1rem,2.3vw,2rem)] font-black leading-none tracking-tight text-[#11a4ad]">
                      {validFrom}
                    </p>
                  </div>
                  <div>
                    <p className="text-[clamp(0.66rem,1vw,0.85rem)] font-semibold uppercase leading-none tracking-[0.12em] text-[#11a4ad]">
                      Sampai
                    </p>
                    <p className="text-[clamp(0.66rem,1vw,0.85rem)] font-semibold uppercase leading-none tracking-[0.12em] text-[#11a4ad]">
                      Dengan
                    </p>
                    <p className="mt-1 text-[clamp(1.1rem,2.3vw,2rem)] font-black leading-none tracking-tight text-[#11a4ad]">
                      {validUntil}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
