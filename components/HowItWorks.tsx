export default function HowItWorks() {
  const steps = [
    {
      title: "Mahasiswa membuat akun atau login",
      desc: "Mahasiswa bisa register langsung dari website, lalu masuk ke portal dengan email atau NIM.",
    },
    {
      title: "Akses semua layanan kampus",
      desc: "Mahasiswa membuka akademik, pembayaran, KRS, pengumuman, notifikasi, dan profil dari satu tempat.",
    },
    {
      title: "Admin memantau dan memvalidasi",
      desc: "Admin dapat mengelola pengumuman, pembayaran, KRS, data akademik, dan notifikasi mahasiswa.",
    },
    {
      title: "Data tampil real-time di dashboard",
      desc: "Semua informasi penting otomatis diringkas ke dashboard mahasiswa agar lebih cepat dipahami.",
    },
  ];

  return (
    <section id="alur" className="bg-white">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="max-w-3xl mb-12">
          <p className="text-sm font-semibold text-blue-700 mb-3">
            Alur penggunaan
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-blue-950 mb-4">
            Sederhana dipakai, lengkap fiturnya
          </h2>
          <p className="text-gray-600 leading-8">
            Portal ini dibuat supaya mahasiswa tidak bingung lagi dengan banyak sistem yang terpisah.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative rounded-3xl border border-gray-200 bg-gray-50 p-6"
            >
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-900 text-white text-lg font-bold">
                {index + 1}
              </div>
              <h3 className="text-lg font-bold text-blue-950 mb-3">{step.title}</h3>
              <p className="text-gray-600 leading-7">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}