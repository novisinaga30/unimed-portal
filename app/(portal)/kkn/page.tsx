import InfoNoteCard from "@/components/InfoNoteCard";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";

const kknStats = [
  {
    label: "Status Pendaftaran",
    value: "Terdaftar",
    valueColor: "text-green-600",
  },
  {
    label: "Status Berkas",
    value: "Lengkap",
    valueColor: "text-blue-950",
  },
  {
    label: "Lokasi Penempatan",
    value: "Deli Serdang",
    valueColor: "text-blue-950",
  },
  {
    label: "Dosen Pembimbing",
    value: "Dr. Maya Sari",
    valueColor: "text-blue-950",
  },
];

const kknSchedules = [
  {
    title: "Pendaftaran KKN",
    detail: "01 Juli 2026 - 15 Juli 2026",
  },
  {
    title: "Pembekalan Peserta",
    detail: "20 Juli 2026 • Aula Kampus",
  },
  {
    title: "Pelaksanaan KKN",
    detail: "01 Agustus 2026 - 30 Agustus 2026",
  },
  {
    title: "Pengumpulan Laporan",
    detail: "Maksimal 05 September 2026",
  },
];

const kknMenus = [
  "Pendaftaran KKN",
  "Status Berkas",
  "Lokasi Penempatan",
  "Dosen Pembimbing",
  "Laporan KKN",
];

const kknPlacement = [
  { label: "Kabupaten", value: "Deli Serdang" },
  { label: "Kecamatan", value: "Percut Sei Tuan" },
  { label: "Desa", value: "Bandar Khalipah" },
  { label: "Kelompok", value: "Kelompok 12" },
];

const kknNotes = [
  {
    title: "Pembekalan Wajib Diikuti",
    description:
      "Seluruh peserta wajib mengikuti pembekalan sebelum diterjunkan ke lokasi KKN.",
    borderColor: "border-yellow-400",
    bgColor: "bg-yellow-50",
  },
  {
    title: "Laporan Harus Tepat Waktu",
    description:
      "Laporan akhir KKN harus dikumpulkan sesuai jadwal agar nilai dapat diproses.",
    borderColor: "border-blue-400",
    bgColor: "bg-blue-50",
  },
];

export default function KKNPage() {
  return (
    <>
      <PageHeader
        title="KKN"
        description="Informasi Kuliah Kerja Nyata mahasiswa Universitas Negeri Medan"
      />

      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kknStats.map((stat, index) => (
            <StatCard key={index} stat={stat} />
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-blue-950 mb-4">
              Jadwal KKN
            </h2>

            <div className="space-y-4">
              {kknSchedules.map((item, index) => (
                <div key={index} className="border rounded-xl p-4">
                  <p className="font-semibold text-blue-900">{item.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-blue-950 mb-4">Menu KKN</h2>

            <div className="space-y-3">
              {kknMenus.map((menu, index) => (
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
              {kknPlacement.map((item, index) => (
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
              Informasi Penting KKN
            </h2>

            <div className="space-y-4">
              {kknNotes.map((note, index) => (
                <InfoNoteCard key={index} note={note} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}