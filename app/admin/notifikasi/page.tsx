"use client";

import { FormEvent, useEffect, useState } from "react";
import { getStoredUser } from "@/lib/auth-client";
import type { LoggedInUser } from "@/types/auth";
import Link from "next/link";

type AdminUser = {
  id: number;
  fullName: string;
  nim: string;
  email: string;
  role: string;
};

type NotificationItem = {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  emailSent: boolean;
  createdAt: string;
  user: {
    id: number;
    fullName: string;
    nim: string;
    email: string;
  };
};

export default function AdminNotifikasiPage() {
  const [currentUser, setCurrentUser] = useState<LoggedInUser | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const [userId, setUserId] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("info");
  const [sendEmail, setSendEmail] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchUsers() {
    const response = await fetch("/api/users");
    const result = await response.json();

    if (response.ok) {
      setUsers(result.data.filter((item: AdminUser) => item.role === "student"));
    }
  }

  async function fetchNotifications() {
    const response = await fetch("/api/notifications");
    const result = await response.json();

    if (response.ok) {
      setNotifications(result.data);
    }
  }

  useEffect(() => {
    const current = getStoredUser();
    setCurrentUser(current);
    fetchUsers();
    fetchNotifications();
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await fetch("/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: Number(userId),
          title,
          message,
          type,
          sendEmail,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(result.message || "Gagal mengirim notifikasi");
        return;
      }

      setSuccessMessage(result.message || "Notifikasi berhasil dikirim");
      setUserId("");
      setTitle("");
      setMessage("");
      setType("info");
      setSendEmail(false);
      fetchNotifications();
    } catch (error) {
      console.error("Send notification error:", error);
      setErrorMessage("Terjadi kesalahan saat mengirim notifikasi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <header className="bg-blue-950 text-white">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <p className="text-sm text-blue-200 mb-1">Admin Panel</p>
          <h1 className="text-3xl font-bold">Kelola Notifikasi Mahasiswa</h1>
          <p className="text-blue-100 mt-2">
            Selamat datang, {currentUser?.fullName || "Admin"}
          </p>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-8">
        {successMessage && (
          <div className="mb-6 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-blue-950 mb-4">
              Kirim Notifikasi
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <select
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3"
              >
                <option value="">Pilih Mahasiswa</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.fullName} - {user.nim}
                  </option>
                ))}
              </select>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Judul notifikasi"
                className="w-full border border-gray-300 rounded-xl px-4 py-3"
              />

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Isi notifikasi"
                rows={5}
                className="w-full border border-gray-300 rounded-xl px-4 py-3"
              />

              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3"
              >
                <option value="info">info</option>
                <option value="warning">warning</option>
                <option value="success">success</option>
              </select>

              <label className="flex items-center gap-3 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={sendEmail}
                  onChange={(e) => setSendEmail(e.target.checked)}
                />
                Kirim juga ke email mahasiswa
              </label>

              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-blue-900 px-5 py-3 text-sm font-medium text-white hover:bg-blue-800 transition disabled:opacity-60"
              >
                {loading ? "Mengirim..." : "Kirim Notifikasi"}
              </button>
            </form>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h2 className="text-xl font-bold text-blue-950">
                Riwayat Notifikasi
              </h2>

              <button
                onClick={fetchNotifications}
                className="rounded-xl bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 transition"
              >
                Refresh
              </button>
            </div>

            <div className="space-y-4 max-h-[650px] overflow-auto pr-2">
              {notifications.length === 0 ? (
                <p className="text-gray-600">Belum ada notifikasi.</p>
              ) : (
                notifications.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-gray-200 p-4"
                  >
                    <p className="text-xs font-semibold uppercase text-blue-700 mb-2">
                      {item.type}
                    </p>
                    <h3 className="font-semibold text-blue-950 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {item.message}
                    </p>
                    <p className="text-sm text-gray-500">
                      {item.user.fullName} • {item.user.nim}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Dibuat: {new Date(item.createdAt).toLocaleString("id-ID")}
                    </p>
                    <p className="text-xs text-gray-400">
                      Email: {item.emailSent ? "Terkirim" : "Tidak dikirim"} •
                      Status baca: {item.isRead ? "Sudah dibaca" : "Belum dibaca"}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <Link
            href="/admin"
            className="rounded-xl bg-blue-900 px-5 py-3 text-white font-medium hover:bg-blue-800 transition"
          >
            Kembali ke Admin
          </Link>

          <Link
            href="/dashboard"
            className="rounded-xl border border-blue-900 px-5 py-3 text-blue-900 font-medium hover:bg-blue-50 transition"
          >
            Ke Dashboard Mahasiswa
          </Link>
        </div>
      </section>
    </main>
  );
}