import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="bg-blue-950 text-white">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="rounded-[32px] border border-white/10 bg-white/10 p-8 md:p-12 backdrop-blur">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-yellow-300 mb-3">
              Siap digunakan dan dikembangkan lebih lanjut
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Portal Mahasiswa Unimed yang lebih terpusat, modern, dan efisien
            </h2>
            <p className="text-blue-100 leading-8 mb-8">
              Cocok untuk presentasi tugas akhir, portfolio fullstack, maupun pengembangan sistem kampus
              yang lebih serius di masa depan.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/register"
                className="rounded-2xl bg-yellow-400 px-6 py-3 font-semibold text-blue-950 hover:bg-yellow-300 transition"
              >
                Coba Register
              </Link>

              <Link
                href="/login"
                className="rounded-2xl border border-white/20 px-6 py-3 font-medium text-white hover:bg-white/10 transition"
              >
                Masuk ke Portal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}