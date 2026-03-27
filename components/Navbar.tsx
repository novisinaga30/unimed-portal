import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-blue-950/95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Unimed Portal</h1>
          <p className="text-xs text-blue-200">Portal Terpadu Mahasiswa</p>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-blue-100">
          <a href="#hero" className="hover:text-white transition">
            Beranda
          </a>
          <a href="#fitur" className="hover:text-white transition">
            Fitur
          </a>
          <a href="#alur" className="hover:text-white transition">
            Alur
          </a>
          <a href="#testimoni" className="hover:text-white transition">
            Testimoni
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/register"
            className="hidden sm:inline-flex rounded-xl border border-blue-200 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition"
          >
            Register
          </Link>

          <Link
            href="/login"
            className="rounded-xl bg-yellow-400 px-4 py-2 text-sm font-semibold text-blue-950 hover:bg-yellow-300 transition"
          >
            Login
          </Link>
        </div>
      </div>
    </header>
  );
}