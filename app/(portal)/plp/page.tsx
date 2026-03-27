import InfoNoteCard from "@/components/InfoNoteCard";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";

const plpStats = [
  {
    label: "Status Pendaftaran",
    value: "Terdaftar",
    valueColor: "text-green-600",
  },
  {
    label: "Status Administrasi",
    value: "Lengkap",
    valueColor: "text-blue-950",
  },
  {
    label: "Sekolah Penempatan",
    value: "SMA Negeri 3 Medan",
    valueColor: "text-blue-950",
  },
  {
    label: "Dosen Pembimbing",
    value: "Dr. Andi Pratama",
    valueColor: "text-blue-950",
  },
];

const plpSchedules = [
  {
    title: "Pendaftaran PLP",
    detail: "01 September 2026 - 10 September 2026",
  },
  {
    title: "Pembekalan PLP",
    detail: "15 September 2026 • Aula Fakultas",
  },
  {
    title: "Pelaksanaan PLP",
    detail: "20 September 2026 - 20 November 2026",
  },
  {
    title: "Pengumpulan Laporan",
    detail: "Maksimal 25 November 2026",
  },
];

const plpMenus = [
  "Pendaftaran PLP",
  "Status Administrasi",
  "Sekolah Penempatan",
  "Dosen Pembimbing",
  "Upload Laporan",
];

const plpPlacement = [
  { label: "Sekolah", value: "SMA Negeri 3 Medan" },
  { label: "Alamat", value: "Jl. Budi Kemasyarakatan, Medan" },
  { label: "Guru Pamong", value: "Siti Rahma, S.Pd." },
  { label: "Kelompok", value: "PLP Informatika 04" },
];

const plpNotes = [
  {
    title: "Pembekalan Bersifat Wajib",
    description:
      "Mahasiswa wajib mengikuti pembekalan sebelum melaksanakan kegiatan PLP di sekolah penempatan.",
    borderColor: "border-yellow-400",
    bgColor: "bg-yellow-50",
  },
  {
    title: "Laporan Dikumpulkan Tepat Waktu",
    description:
      "Pastikan laporan PLP dikumpulkan sebelum batas waktu agar proses penilaian berjalan lancar.",
    borderColor: "border-blue-400",
    bgColor: "bg-blue-50",
  },
];

export default function PLPPage() {
  return (
    <>
      <PageHeader
        title="PLP"
        description="Informasi Praktik Lapangan Persekolahan mahasiswa Universitas Negeri Medan"
      />

      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {plpStats.map((stat, index) => (
            <StatCard key={index} stat={stat} />
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-blue-950 mb-4">
              Jadwal PLP
            </h2>

            <div className="space-y-4">
              {plpSchedules.map((item, index) => (
                <div key={index} className="border rounded-xl p-4">
                  <p className="font-semibold text-blue-900">{item.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-blue-950 mb-4">Menu PLP</h2>

            <div className="space-y-3">
              {plpMenus.map((menu, index) => (
                <button
                  key={index}
                  className="w-full text-left bg-gray-50 hover:bg-gray-100 rounded-xl px-4 py-3 transition"
                >
                  {menu}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-blue-950 mb-4">
              Detail Penempatan
            </h2>

            <div className="space-y-3 text-gray-700">
              {plpPlacement.map((item, index) => (
                <p key={index}>
                  <span className="font-semibold text-blue-900">
                    {item.label}:
                  </span>{" "}
                  {item.value}
                </p>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-blue-950 mb-4">
              Informasi Penting PLP
            </h2>

            <div className="space-y-4">
              {plpNotes.map((note, index) => (
                <InfoNoteCard key={index} note={note} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}