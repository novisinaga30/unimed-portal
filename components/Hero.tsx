import Link from "next/link";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white"
    >
      <div className="absolute inset-0 opacity-20">
        <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-yellow-300 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-blue-300 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-14 items-center">
        <div>
          <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-blue-100 border border-white/10 mb-6">
            Solusi Portal Mahasiswa Universitas Negeri Medan
          </span>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Satu Portal untuk
            <span className="text-yellow-300"> Akademik, Pembayaran, KRS, </span>
            dan Semua Layanan Mahasiswa
          </h2>

          <p className="text-lg text-blue-100 max-w-2xl mb-8 leading-8">
            Portal ini dirancang untuk mengatasi website kampus yang sering down,
            terpisah-pisah, dan membingungkan. Mahasiswa bisa mengakses semua
            layanan penting dalam satu sistem yang lebih modern, rapi, dan mudah digunakan.
          </p>

          <div className="flex flex-wrap gap-4 mb-10">
            <Link
              href="/login"
              className="rounded-2xl bg-yellow-400 px-6 py-3 text-base font-semibold text-blue-950 hover:bg-yellow-300 transition"
            >
              Masuk ke Portal
            </Link>

            <Link
              href="/register"
              className="rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-base font-medium text-white hover:bg-white/20 transition"
            >
              Buat Akun Mahasiswa
            </Link>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <p className="text-2xl font-bold">1 Portal</p>
              <p className="text-sm text-blue-100 mt-1">Semua layanan terpadu</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <p className="text-2xl font-bold">24/7</p>
              <p className="text-sm text-blue-100 mt-1">Akses kapan saja</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <p className="text-2xl font-bold">Smart</p>
              <p className="text-sm text-blue-100 mt-1">Dashboard mahasiswa pintar</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-[32px] border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur">
            <div className="rounded-[28px] bg-white p-6 text-gray-800">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-gray-500">Preview Dashboard</p>
                  <h3 className="text-2xl font-bold text-blue-950">
                    Portal Mahasiswa Unimed
                  </h3>
                </div>

                <div className="flex gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-400" />
                  <span className="h-3 w-3 rounded-full bg-yellow-400" />
                  <span className="h-3 w-3 rounded-full bg-green-400" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div className="rounded-2xl bg-blue-50 p-4 border border-blue-100">
                  <p className="text-sm text-gray-500">Status KRS</p>
                  <p className="text-xl font-bold text-blue-950 mt-1">Pending</p>
                </div>

                <div className="rounded-2xl bg-green-50 p-4 border border-green-100">
                  <p className="text-sm text-gray-500">Status UKT</p>
                  <p className="text-xl font-bold text-green-600 mt-1">Lunas</p>
                </div>

                <div className="rounded-2xl bg-yellow-50 p-4 border border-yellow-100">
                  <p className="text-sm text-gray-500">Notifikasi Baru</p>
                  <p className="text-xl font-bold text-yellow-600 mt-1">3</p>
                </div>

                <div className="rounded-2xl bg-purple-50 p-4 border border-purple-100">
                  <p className="text-sm text-gray-500">IPK</p>
                  <p className="text-xl font-bold text-purple-700 mt-1">3.82</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded-2xl border border-gray-200 p-4">
                  <p className="font-semibold text-blue-900">Pemrograman Web</p>
                  <p className="text-sm text-gray-500">08:00 - 10:00 • 3 SKS</p>
                </div>

                <div className="rounded-2xl border border-gray-200 p-4">
                  <p className="font-semibold text-blue-900">Basis Data</p>
                  <p className="text-sm text-gray-500">10:30 - 12:00 • 3 SKS</p>
                </div>

                <div className="rounded-2xl border border-gray-200 p-4">
                  <p className="font-semibold text-blue-900">Pengumuman Kampus</p>
                  <p className="text-sm text-gray-500">
                    Jadwal pengisian KRS semester ganjil telah dibuka
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}