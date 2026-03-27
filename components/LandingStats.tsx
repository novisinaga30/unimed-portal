export default function LandingStats() {
  const stats = [
    {
      label: "Layanan Terintegrasi",
      value: "10+",
      desc: "Akademik, KRS, pembayaran, notifikasi, profil, dan lainnya",
    },
    {
      label: "Akses Mahasiswa",
      value: "1 Akun",
      desc: "Semua kebutuhan kampus cukup dengan satu akun portal",
    },
    {
      label: "Pengalaman Lebih Cepat",
      value: "Modern",
      desc: "Tampilan rapi, responsif, dan mudah digunakan",
    },
    {
      label: "Monitoring Admin",
      value: "Real-time",
      desc: "Data mahasiswa, pembayaran, KRS, dan pengumuman terkendali",
    },
  ];

  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((item, index) => (
            <div
              key={index}
              className="rounded-3xl border border-gray-200 bg-gray-50 p-6 shadow-sm"
            >
              <p className="text-3xl font-bold text-blue-950">{item.value}</p>
              <h3 className="text-lg font-semibold text-gray-900 mt-3">
                {item.label}
              </h3>
              <p className="text-sm text-gray-600 mt-2 leading-6">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}