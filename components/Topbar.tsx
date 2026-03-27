"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getStoredUser } from "@/lib/auth-client";
import type { LoggedInUser } from "@/types/auth";
import Link from "next/link";

type TopbarProps = {
  title?: string;
};

export default function Topbar({ title = "Portal Mahasiswa" }: TopbarProps) {
  const router = useRouter();
  const [user, setUser] = useState<LoggedInUser | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const currentUser = getStoredUser();
    setUser(currentUser);

    if (currentUser) {
      fetch(`/api/notifications?userId=${currentUser.id}`)
        .then((res) => res.json())
        .then((result) => {
          if (result.success) {
            const unread = result.data.filter(
              (item: { isRead: boolean }) => !item.isRead
            ).length;
            setUnreadCount(unread);
          }
        })
        .catch((error) => {
          console.error("Fetch notifications error:", error);
        });
    }
  }, []);

  async function handleLogout() {
    await fetch("/api/logout");
    localStorage.removeItem("user");
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500">Selamat datang</p>
          <h2 className="text-lg font-semibold text-blue-950">{title}</h2>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/notifikasi"
            className="relative hidden md:inline-flex rounded-xl border border-blue-900 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-50 transition"
          >
            Notifikasi
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 min-w-[22px] h-[22px] px-1 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Link>

          {user?.role === "admin" && (
            <Link
              href="/admin"
              className="hidden md:inline-flex rounded-xl border border-blue-900 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-50 transition"
            >
              Admin Panel
            </Link>
          )}

          <div className="hidden md:flex items-center gap-3">
            {user?.photoUrl ? (
              <img
                src={user.photoUrl}
                alt={user.fullName}
                className="w-10 h-10 rounded-full object-cover border border-gray-200"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center font-semibold">
                {user?.fullName?.charAt(0).toUpperCase() || "M"}
              </div>
            )}

            <div className="text-right">
              <p className="text-sm font-medium text-blue-950">
                {user?.fullName || "Mahasiswa"}
              </p>
              <p className="text-xs text-gray-500">
                {user?.role === "admin"
                  ? "Administrator"
                  : user?.role === "student"
                  ? "Mahasiswa Aktif"
                  : user?.role || "-"}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-xl bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}