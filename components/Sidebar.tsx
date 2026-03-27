"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const menus = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Akademik", href: "/akademik" },
    { name: "Pembayaran", href: "/pembayaran" },
    { name: "KKN", href: "/kkn" },
    { name: "PLP", href: "/plp" },
    { name: "Pengumuman", href: "/pengumuman" },
    { name: "Profil", href: "/profil" },
    { name: "Bantuan", href: "/bantuan" },
    { name: "Notifikasi", href: "/notifikasi" },
  ];

  return (
    <aside className="w-full lg:w-64 bg-blue-950 text-white min-h-screen p-6">
      <div className="mb-10">
        <h2 className="text-2xl font-bold">Unimed Portal</h2>
        <p className="text-sm text-blue-200 mt-1">Portal Mahasiswa</p>
      </div>

      <nav className="space-y-3">
        {menus.map((menu) => {
          const isActive = pathname === menu.href;

          return (
            <Link
              key={menu.href}
              href={menu.href}
              className={`block rounded-xl px-4 py-3 transition ${
                isActive
                  ? "bg-white text-blue-950 font-semibold"
                  : "hover:bg-blue-800 text-white"
              }`}
            >
              {menu.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}