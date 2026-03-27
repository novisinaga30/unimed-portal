export default function FeatureHighlight() {
  const items = [
    {
      title: "Semua layanan dalam satu portal",
      desc: "Mahasiswa tidak perlu lagi pindah-pindah website akademik, billing, KKN, PLP, dan pengumuman.",
    },
    {
      title: "Dashboard mahasiswa pintar",
      desc: "Mahasiswa langsung melihat status KRS, tagihan aktif, notifikasi, dan ringkasan akademik secara otomatis.",
    },
    {
      title: "Admin panel lengkap",
      desc: "Admin dapat mengelola mahasiswa, pengumuman, pembayaran, akademik, notifikasi, dan validasi KRS.",
    },
    {
      title: "Lebih modern dan mudah dipahami",
      desc: "Desain yang sederhana, responsif, dan cocok dipakai mahasiswa maupun admin kampus.",
    },
    {
      title: "Siap dikembangkan lagi",
      desc: "Portal ini sudah fullstack dan bisa dilanjutkan ke fitur produksi seperti upload cloud, deploy online, dan integrasi sistem kampus.",
    },
    {
      title: "Aman dan terstruktur",
      desc: "Sudah memiliki login, register, role admin, proteksi halaman, reset password email, dan validasi data.",
    },
  ];

  return (
    <section id="fitur" className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="max-w-3xl mb-12">
          <p className="text-sm font-semibold text-blue-700 mb-3">
            Kenapa portal ini lebih baik?
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-blue-950 mb-4">
            Dirancang untuk mempermudah mahasiswa dan admin kampus
          </h2>
          <p className="text-gray-600 leading-8">
            Website ini bukan hanya tampilan, tetapi sudah mengarah ke sistem portal kampus
            yang benar-benar bisa digunakan untuk aktivitas mahasiswa sehari-hari.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <div
              key={index}
              className="rounded-3xl bg-white border border-gray-200 p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-900 flex items-center justify-center font-bold mb-4">
                {index + 1}
              </div>
              <h3 className="text-xl font-bold text-blue-950 mb-3">{item.title}</h3>
              <p className="text-gray-600 leading-7">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}