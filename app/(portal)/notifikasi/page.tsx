"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { getStoredUser } from "@/lib/auth-client";
import type { LoggedInUser } from "@/types/auth";

type NotificationItem = {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  emailSent: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function NotifikasiPage() {
  const [user, setUser] = useState<LoggedInUser | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  async function fetchNotifications(userId: number) {
    try {
      setLoading(true);

      const response = await fetch(`/api/notifications?userId=${userId}`);
      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(result.message || "Gagal mengambil notifikasi");
        return;
      }

      setNotifications(result.data);
    } catch (error) {
      console.error("Fetch notifications error:", error);
      setErrorMessage("Terjadi kesalahan saat mengambil notifikasi");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const currentUser = getStoredUser();
    setUser(currentUser);

    if (currentUser) {
      fetchNotifications(currentUser.id);
    }
  }, []);

  async function handleMarkAsRead(notificationId: number) {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: "PUT",
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(result.message || "Gagal memperbarui notifikasi");
        return;
      }

      if (user) {
        fetchNotifications(user.id);
      }
    } catch (error) {
      console.error("Mark as read error:", error);
      setErrorMessage("Terjadi kesalahan saat memperbarui notifikasi");
    }
  }

  return (
    <>
      <PageHeader
        title="Notifikasi"
        description="Daftar notifikasi dan pemberitahuan untuk mahasiswa"
      />

      <section className="max-w-5xl mx-auto px-6 py-8">
        {errorMessage && (
          <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <p className="text-gray-600">Memuat notifikasi...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <p className="text-gray-600">Belum ada notifikasi.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-2xl shadow-md p-6 border ${
                  item.isRead ? "border-gray-100" : "border-blue-300"
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 mb-2">
                      {item.type}
                    </p>
                    <h2 className="text-xl font-bold text-blue-950">
                      {item.title}
                    </h2>
                  </div>

                  {!item.isRead && (
                    <span className="rounded-full bg-red-100 text-red-600 text-xs font-semibold px-3 py-1">
                      Baru
                    </span>
                  )}
                </div>

                <p className="text-gray-600 mb-4">{item.message}</p>

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="text-sm text-gray-500">
                    <p>Dikirim: {new Date(item.createdAt).toLocaleString("id-ID")}</p>
                    <p>Email: {item.emailSent ? "Terkirim" : "Tidak dikirim"}</p>
                  </div>

                  {!item.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(item.id)}
                      className="rounded-xl bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 transition"
                    >
                      Tandai Sudah Dibaca
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}