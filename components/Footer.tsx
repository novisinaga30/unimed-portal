export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-2xl font-bold">Unimed Portal</h3>
          <p className="text-sm text-slate-300 mt-3 leading-7">
            Portal terpadu mahasiswa Universitas Negeri Medan untuk akademik,
            pembayaran, KRS, pengumuman, notifikasi, dan layanan kampus lainnya.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-lg mb-4">Navigasi</h4>
          <ul className="space-y-3 text-sm text-slate-300">
            <li>Beranda</li>
            <li>Fitur Portal</li>
            <li>Alur Penggunaan</li>
            <li>Testimoni</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-lg mb-4">Tentang Proyek</h4>
          <p className="text-sm text-slate-300 leading-7">
            Dibuat sebagai solusi portal mahasiswa yang lebih terintegrasi,
            efisien, dan mudah digunakan dibanding sistem yang terpisah-pisah.
          </p>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-5 text-sm text-slate-400 flex flex-col md:flex-row items-center justify-between gap-3">
          <p>© 2026 Unimed Portal. All rights reserved.</p>
          <p>Developed for student-centered campus experience.</p>
        </div>
      </div>
    </footer>
  );
}