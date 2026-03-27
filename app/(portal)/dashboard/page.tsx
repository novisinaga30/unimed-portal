"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import InfoNoteCard from "@/components/InfoNoteCard";
import StatCard from "@/components/StatCard";
import { getStoredUser } from "@/lib/auth-client";
import type { LoggedInUser } from "@/types/auth";

type PaymentItem = {
  id: number;
  userId: number;
  title: string;
  amount: number;
  status: string;
  method: string | null;
  paidAt: string | null;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
};

type KrsItem = {
  id: number;
  userId: number;
  courseId: number;
  semester: string;
  status: string;
  approval: string;
  adminNote?: string | null;
  createdAt: string;
  updatedAt: string;
  course: {
    id: number;
    code: string;
    name: string;
    credits: number;
    lecturer: string;
    semester: string;
  };
};

type AcademicItem = {
  id: number;
  userId: number;
  semester: string;
  sks: number;
  ips: number;
  ipk: number;
  krsStatus: string;
  createdAt: string;
  updatedAt: string;
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
  updatedAt: string;
};

export default function DashboardPage() {
  const [user, setUser] = useState<LoggedInUser | null>(null);

  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [krsItems, setKrsItems] = useState<KrsItem[]>([]);
  const [academics, setAcademics] = useState<AcademicItem[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const currentUser = getStoredUser();
    setUser(currentUser);
  }, []);

  useEffect(() => {
    async function fetchDashboardData() {
      const currentUser = getStoredUser();
      if (!currentUser) return;

      try {
        setLoading(true);

        const [paymentsRes, krsRes, academicsRes, notificationsRes] =
          await Promise.all([
            fetch("/api/payments"),
            fetch("/api/krs"),
            fetch("/api/academics"),
            fetch(`/api/notifications?userId=${currentUser.id}`),
          ]);

        const paymentsJson = await paymentsRes.json();
        const krsJson = await krsRes.json();
        const academicsJson = await academicsRes.json();
        const notificationsJson = await notificationsRes.json();

        if (paymentsRes.ok) {
          setPayments(
            paymentsJson.data.filter(
              (item: PaymentItem) => item.userId === currentUser.id
            )
          );
        }

        if (krsRes.ok) {
          setKrsItems(
            krsJson.data.filter((item: KrsItem) => item.userId === currentUser.id)
          );
        }

        if (academicsRes.ok) {
          setAcademics(
            academicsJson.data.filter(
              (item: AcademicItem) => item.userId === currentUser.id
            )
          );
        }

        if (notificationsRes.ok) {
          setNotifications(notificationsJson.data);
        }
      } catch (error) {
        console.error(error);
        setErrorMessage("Terjadi kesalahan saat mengambil data dashboard");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const latestAcademic = academics.length > 0 ? academics[0] : null;

  const totalActiveBills = payments
    .filter((item) => item.status === "unpaid")
    .reduce((sum, item) => sum + item.amount, 0);

  const unreadNotifications = notifications.filter((item) => !item.isRead).length;

  const approvedKrsCount = krsItems.filter(
    (item) => item.approval === "approved"
  ).length;

  const pendingKrsCount = krsItems.filter(
    (item) => item.approval === "pending"
  ).length;

  const rejectedKrsCount = krsItems.filter(
    (item) => item.approval === "rejected"
  ).length;

  const totalCredits = krsItems.reduce((sum, item) => sum + item.course.credits, 0);

  const dashboardStats = [
    {
      label: "Total SKS Diambil",
      value: String(totalCredits),
      valueColor: "text-blue-950",
    },
    {
      label: "Tagihan Aktif",
      value: `Rp ${totalActiveBills.toLocaleString("id-ID")}`,
      valueColor: totalActiveBills > 0 ? "text-red-500" : "text-green-600",
    },
    {
      label: "Notifikasi Baru",
      value: String(unreadNotifications),
      valueColor: unreadNotifications > 0 ? "text-yellow-500" : "text-green-600",
    },
    {
      label: "Status KRS",
      value: latestAcademic?.krsStatus || "Belum Ada",
      valueColor: "text-blue-950",
    },
  ];

  const quickMenus = [
    { title: "Akademik", href: "/akademik" },
    { title: "Pembayaran", href: "/pembayaran" },
    { title: "Pengumuman", href: "/pengumuman" },
    { title: "Notifikasi", href: "/notifikasi" },
    { title: "Profil", href: "/profil" },
    { title: "Bantuan", href: "/bantuan" },
  ];

  const smartNotes = useMemo(() => {
    const notes = [];

    if (totalActiveBills > 0) {
      notes.push({
        title: "Masih Ada Tagihan Aktif",
        description: `Kamu masih memiliki tagihan sebesar Rp ${totalActiveBills.toLocaleString(
          "id-ID"
        )}. Segera cek halaman pembayaran agar tidak melewati jatuh tempo.`,
        borderColor: "border-red-400",
        bgColor: "bg-red-50",
      });
    }

    if (pendingKrsCount > 0) {
      notes.push({
        title: "KRS Menunggu Validasi",
        description: `${pendingKrsCount} mata kuliah kamu masih menunggu persetujuan admin.`,
        borderColor: "border-yellow-400",
        bgColor: "bg-yellow-50",
      });
    }

    if (rejectedKrsCount > 0) {
      notes.push({
        title: "Ada KRS Ditolak",
        description: `${rejectedKrsCount} mata kuliah ditolak. Cek halaman akademik untuk melihat catatan admin.`,
        borderColor: "border-red-400",
        bgColor: "bg-red-50",
      });
    }

    if (approvedKrsCount > 0) {
      notes.push({
        title: "KRS Sudah Disetujui",
        description: `${approvedKrsCount} mata kuliah kamu sudah disetujui.`,
        borderColor: "border-green-400",
        bgColor: "bg-green-50",
      });
    }

    if (unreadNotifications > 0) {
      notes.push({
        title: "Ada Notifikasi Baru",
        description: `Kamu memiliki ${unreadNotifications} notifikasi yang belum dibaca.`,
        borderColor: "border-blue-400",
        bgColor: "bg-blue-50",
      });
    }

    if (notes.length === 0) {
      notes.push({
        title: "Semua Aman",
        description:
          "Saat ini tidak ada peringatan penting. Tetap cek portal secara berkala untuk informasi terbaru.",
        borderColor: "border-green-400",
        bgColor: "bg-green-50",
      });
    }

    return notes;
  }, [
    totalActiveBills,
    pendingKrsCount,
    rejectedKrsCount,
    approvedKrsCount,
    unreadNotifications,
  ]);

  const recentNotifications = notifications.slice(0, 3);
  const recentPayments = payments.slice(0, 3);
  const recentKrs = krsItems.slice(0, 4);

  return (
    <>
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-blue-950">
              Dashboard Mahasiswa Pintar
            </h1>
            <p className="text-sm text-gray-600">
              Ringkasan aktivitas akademik dan administrasi kamu
            </p>
          </div>

          <Link
            href="/"
            className="text-sm font-medium text-blue-900 hover:underline"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-8">
        {errorMessage && (
          <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        <div className="bg-gradient-to-r from-blue-950 to-blue-800 text-white rounded-3xl p-8 mb-8">
          <p className="text-blue-100 mb-2">Halo,</p>
          <h2 className="text-3xl font-bold mb-2">
            {user?.fullName || "Mahasiswa"}
          </h2>
          <p className="text-blue-100">
            NIM: {user?.nim || "-"} • Email: {user?.email || "-"}
          </p>

          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-sm text-blue-100 mb-1">IPS Terakhir</p>
              <p className="text-2xl font-bold">{latestAcademic?.ips ?? 0}</p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-sm text-blue-100 mb-1">IPK</p>
              <p className="text-2xl font-bold">{latestAcademic?.ipk ?? 0}</p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-sm text-blue-100 mb-1">Mata Kuliah Diambil</p>
              <p className="text-2xl font-bold">{krsItems.length}</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => (
            <StatCard key={index} stat={stat} />
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-blue-950 mb-4">
              Alert Pintar untuk Kamu
            </h3>

            <div className="space-y-4">
              {smartNotes.map((note, index) => (
                <InfoNoteCard key={index} note={note} />
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-blue-950 mb-4">Menu Cepat</h3>

            <div className="space-y-3">
              {quickMenus.map((menu, index) => (
                <Link
                  key={index}
                  href={menu.href}
                  className="block w-full text-left bg-gray-50 hover:bg-blue-50 hover:text-blue-900 rounded-xl px-4 py-3 transition font-medium"
                >
                  {menu.title}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-blue-950 mb-4">
              Notifikasi Terbaru
            </h3>

            {loading ? (
              <p className="text-gray-600">Memuat data...</p>
            ) : recentNotifications.length === 0 ? (
              <p className="text-gray-600">Belum ada notifikasi.</p>
            ) : (
              <div className="space-y-4">
                {recentNotifications.map((item) => (
                  <div key={item.id} className="border rounded-xl p-4">
                    <p className="font-semibold text-blue-900">{item.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{item.message}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(item.createdAt).toLocaleString("id-ID")}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-blue-950 mb-4">
              Ringkasan KRS
            </h3>

            {loading ? (
              <p className="text-gray-600">Memuat data...</p>
            ) : recentKrs.length === 0 ? (
              <p className="text-gray-600">Belum ada mata kuliah di KRS.</p>
            ) : (
              <div className="space-y-4">
                {recentKrs.map((item) => (
                  <div key={item.id} className="border rounded-xl p-4">
                    <p className="font-semibold text-blue-900">
                      {item.course.code} - {item.course.name}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {item.course.credits} SKS • Semester {item.semester}
                    </p>
                    <p className="text-xs mt-2">
                      Approval:{" "}
                      <span
                        className={
                          item.approval === "approved"
                            ? "font-semibold text-green-600"
                            : item.approval === "rejected"
                            ? "font-semibold text-red-500"
                            : "font-semibold text-yellow-600"
                        }
                      >
                        {item.approval}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-blue-950 mb-4">
              Riwayat Pembayaran
            </h3>

            {loading ? (
              <p className="text-gray-600">Memuat data...</p>
            ) : recentPayments.length === 0 ? (
              <p className="text-gray-600">Belum ada pembayaran.</p>
            ) : (
              <div className="space-y-4">
                {recentPayments.map((item) => (
                  <div key={item.id} className="border rounded-xl p-4">
                    <p className="font-semibold text-blue-900">{item.title}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Rp {item.amount.toLocaleString("id-ID")}
                    </p>
                    <p className="text-xs mt-2">
                      Status:{" "}
                      <span
                        className={
                          item.status === "paid"
                            ? "font-semibold text-green-600"
                            : "font-semibold text-red-500"
                        }
                      >
                        {item.status}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-blue-950 mb-4">
            Rekomendasi Cepat
          </h3>

          <div className="grid md:grid-cols-3 gap-4">
            <Link
              href="/akademik"
              className="rounded-2xl bg-blue-50 border border-blue-100 p-5 hover:bg-blue-100 transition"
            >
              <p className="font-semibold text-blue-950 mb-2">Cek Akademik</p>
              <p className="text-sm text-gray-600">
                Lihat status KRS, catatan admin, dan riwayat akademik.
              </p>
            </Link>

            <Link
              href="/pembayaran"
              className="rounded-2xl bg-yellow-50 border border-yellow-100 p-5 hover:bg-yellow-100 transition"
            >
              <p className="font-semibold text-blue-950 mb-2">Cek Pembayaran</p>
              <p className="text-sm text-gray-600">
                Pantau tagihan aktif dan riwayat pembayaran kamu.
              </p>
            </Link>

            <Link
              href="/notifikasi"
              className="rounded-2xl bg-green-50 border border-green-100 p-5 hover:bg-green-100 transition"
            >
              <p className="font-semibold text-blue-950 mb-2">Baca Notifikasi</p>
              <p className="text-sm text-gray-600">
                Buka notifikasi terbaru dari admin dan sistem kampus.
              </p>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}