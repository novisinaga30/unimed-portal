"use client";

import { useEffect, useMemo, useState } from "react";
import InfoNoteCard from "@/components/InfoNoteCard";
import PageHeader from "@/components/PageHeader";
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
  user: {
    id: number;
    fullName: string;
    nim: string;
    email: string;
    role: string;
  };
};

export default function PembayaranPage() {
  const [user, setUser] = useState<LoggedInUser | null>(null);
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const currentUser = getStoredUser();
    setUser(currentUser);
  }, []);

  useEffect(() => {
    async function fetchPayments() {
      try {
        setLoading(true);
        const response = await fetch("/api/payments");
        const result = await response.json();

        if (!response.ok) {
          setErrorMessage(result.message || "Gagal mengambil pembayaran");
          return;
        }

        setPayments(result.data);
      } catch (error) {
        console.error(error);
        setErrorMessage("Terjadi kesalahan saat mengambil pembayaran");
      } finally {
        setLoading(false);
      }
    }

    fetchPayments();
  }, []);

  const myPayments = useMemo(() => {
    if (!user) return [];
    return payments.filter((payment) => payment.userId === user.id);
  }, [payments, user]);

  const totalTagihan = myPayments
    .filter((payment) => payment.status === "unpaid")
    .reduce((sum, payment) => sum + payment.amount, 0);

  const lastPayment = myPayments.find((payment) => payment.status === "paid");

  const pembayaranStats = [
    {
      label: "Status UKT",
      value: totalTagihan > 0 ? "Belum Lunas" : "Lunas",
      valueColor: totalTagihan > 0 ? "text-red-500" : "text-green-600",
    },
    {
      label: "Tagihan Aktif",
      value: `Rp ${totalTagihan.toLocaleString("id-ID")}`,
      valueColor: "text-blue-950",
    },
    {
      label: "Pembayaran Terakhir",
      value: lastPayment?.paidAt || "-",
      valueColor: "text-blue-950",
    },
    {
      label: "Metode Pembayaran",
      value: lastPayment?.method || "-",
      valueColor: "text-blue-950",
    },
  ];

  const pembayaranNotes = [
    {
      title: "Batas Waktu Pembayaran UKT",
      description:
        "Pastikan pembayaran UKT dilakukan sebelum jatuh tempo agar status akademik tetap aktif.",
      borderColor: "border-yellow-400",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Simpan Bukti Pembayaran",
      description:
        "Mahasiswa disarankan untuk menyimpan bukti pembayaran sebagai arsip pribadi.",
      borderColor: "border-blue-400",
      bgColor: "bg-blue-50",
    },
  ];

  return (
    <>
      <PageHeader
        title="Pembayaran"
        description="Informasi tagihan dan pembayaran mahasiswa Universitas Negeri Medan"
      />

      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {pembayaranStats.map((stat, index) => (
            <StatCard key={index} stat={stat} />
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-blue-950 mb-4">
              Riwayat Pembayaran
            </h2>

            {loading ? (
              <p className="text-gray-600">Memuat pembayaran...</p>
            ) : errorMessage ? (
              <p className="text-red-600">{errorMessage}</p>
            ) : myPayments.length === 0 ? (
              <p className="text-gray-600">Belum ada data pembayaran.</p>
            ) : (
              <div className="space-y-4">
                {myPayments.map((item) => (
                  <div key={item.id} className="border rounded-xl p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-blue-900">{item.title}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {item.paidAt || item.dueDate} • {item.method || "-"}
                        </p>
                        <p className="text-sm mt-1">
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
                      <p className="font-bold text-blue-950">
                        Rp {item.amount.toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-blue-950 mb-4">
              Informasi Akun
            </h2>

            <div className="space-y-4 text-sm text-gray-700">
              <div>
                <p className="text-gray-500 mb-1">Nama</p>
                <p className="font-semibold text-blue-900">
                  {user?.fullName || "-"}
                </p>
              </div>

              <div>
                <p className="text-gray-500 mb-1">NIM</p>
                <p className="font-semibold text-blue-900">{user?.nim || "-"}</p>
              </div>

              <div>
                <p className="text-gray-500 mb-1">Email</p>
                <p className="font-semibold text-blue-900">
                  {user?.email || "-"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-blue-950 mb-4">
            Informasi Pembayaran Penting
          </h2>

          <div className="space-y-4">
            {pembayaranNotes.map((note, index) => (
              <InfoNoteCard key={index} note={note} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}