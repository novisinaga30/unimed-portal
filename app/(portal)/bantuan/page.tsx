import FaqCard from "@/components/FaqCard";
import PageHeader from "@/components/PageHeader";
import { helpFaqs } from "@/lib/dummy-data";

export default function BantuanPage() {
  return (
    <>
      <PageHeader
        title="Bantuan"
        description="Pusat bantuan dan panduan penggunaan portal mahasiswa"
      />

      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <p className="text-sm text-gray-500 mb-2">FAQ Tersedia</p>
            <h3 className="text-2xl font-bold text-blue-950">10</h3>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <p className="text-sm text-gray-500 mb-2">Panduan Portal</p>
            <h3 className="text-2xl font-bold text-blue-950">6</h3>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <p className="text-sm text-gray-500 mb-2">Tiket Bantuan</p>
            <h3 className="text-2xl font-bold text-yellow-500">2</h3>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <p className="text-sm text-gray-500 mb-2">Status Layanan</p>
            <h3 className="text-2xl font-bold text-green-600">Online</h3>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-blue-950 mb-4">
              Pertanyaan yang Sering Ditanyakan
            </h2>

            <div className="space-y-4">
              {helpFaqs.map((faq, index) => (
                <FaqCard key={index} faq={faq} />
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-blue-950 mb-4">
              Menu Bantuan
            </h2>

            <div className="space-y-3">
              <button className="w-full text-left bg-gray-50 hover:bg-gray-100 rounded-xl px-4 py-3 transition">
                FAQ
              </button>
              <button className="w-full text-left bg-gray-50 hover:bg-gray-100 rounded-xl px-4 py-3 transition">
                Panduan Penggunaan
              </button>
              <button className="w-full text-left bg-gray-50 hover:bg-gray-100 rounded-xl px-4 py-3 transition">
                Hubungi Admin
              </button>
              <button className="w-full text-left bg-gray-50 hover:bg-gray-100 rounded-xl px-4 py-3 transition">
                Laporkan Masalah
              </button>
              <button className="w-full text-left bg-gray-50 hover:bg-gray-100 rounded-xl px-4 py-3 transition">
                Status Layanan
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-blue-950 mb-4">
              Panduan Singkat
            </h2>

            <div className="space-y-4">
              <div className="border-l-4 border-blue-400 bg-blue-50 rounded-xl p-4">
                <p className="font-semibold text-blue-900">
                  1. Login ke Portal
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Masuk menggunakan akun mahasiswa untuk mengakses semua fitur.
                </p>
              </div>

              <div className="border-l-4 border-yellow-400 bg-yellow-50 rounded-xl p-4">
                <p className="font-semibold text-blue-900">
                  2. Pilih Menu yang Dibutuhkan
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Gunakan sidebar untuk memilih Akademik, Pembayaran, KKN, PLP,
                  Pengumuman, atau Profil.
                </p>
              </div>

              <div className="border-l-4 border-green-400 bg-green-50 rounded-xl p-4">
                <p className="font-semibold text-blue-900">
                  3. Periksa Informasi Secara Berkala
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Cek portal secara rutin agar tidak tertinggal jadwal atau
                  pengumuman penting.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-blue-950 mb-4">
              Kontak Bantuan
            </h2>

            <div className="space-y-4 text-gray-700">
              <div>
                <p className="text-sm text-gray-500 mb-1">Email Admin</p>
                <p className="font-semibold text-blue-900">
                  admin@unimedportal.ac.id
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Nomor Layanan</p>
                <p className="font-semibold text-blue-900">0812-0000-1234</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Jam Operasional</p>
                <p className="font-semibold text-blue-900">
                  Senin - Jumat, 08:00 - 16:00
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Lokasi</p>
                <p className="font-semibold text-blue-900">
                  Pusat Layanan Akademik Unimed
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}