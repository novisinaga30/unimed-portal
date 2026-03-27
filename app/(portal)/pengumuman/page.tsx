"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import PageHeader from "@/components/PageHeader";
import AnnouncementCard from "@/components/AnnouncementCard";

type AnnouncementItem = {
  id: number;
  category: string;
  title: string;
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
};

export default function PengumumanPage() {
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  async function fetchAnnouncements() {
    try {
      setLoading(true);
      const response = await fetch("/api/announcements");
      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(result.message || "Gagal mengambil pengumuman");
        return;
      }

      setAnnouncements(result.data);
    } catch (error) {
      console.error("Fetch announcements error:", error);
      setErrorMessage("Terjadi kesalahan saat mengambil pengumuman");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return (
    <>
      <PageHeader
        title="Pengumuman"
        description="Informasi terbaru untuk mahasiswa Universitas Negeri Medan"
      />

      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <p className="text-sm text-gray-500 mb-2">Total Pengumuman</p>
            <h3 className="text-2xl font-bold text-blue-950">
              {announcements.length}
            </h3>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <p className="text-sm text-gray-500 mb-2">Kategori Aktif</p>
            <h3 className="text-2xl font-bold text-blue-950">
              {[...new Set(announcements.map((item) => item.category))].length}
            </h3>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <p className="text-sm text-gray-500 mb-2">Pengumuman Baru</p>
            <h3 className="text-2xl font-bold text-yellow-500">
              {announcements.length}
            </h3>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <p className="text-sm text-gray-500 mb-2">Status Portal</p>
            <h3 className="text-2xl font-bold text-green-600">Aktif</h3>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-blue-950 mb-4">
              Pengumuman Terbaru
            </h2>

            {loading ? (
              <p className="text-gray-600">Memuat pengumuman...</p>
            ) : errorMessage ? (
              <p className="text-red-600">{errorMessage}</p>
            ) : announcements.length === 0 ? (
              <p className="text-gray-600">Belum ada pengumuman.</p>
            ) : (
              <div className="space-y-4">
                {announcements.map((item) => (
                  <AnnouncementCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-blue-950 mb-4">
              Kategori Pengumuman
            </h2>

            <div className="space-y-3">
              {[...new Set(announcements.map((item) => item.category))].map(
                (category, index) => (
                  <button
                    key={index}
                    className="w-full text-left bg-gray-50 hover:bg-gray-100 rounded-xl px-4 py-3 transition"
                  >
                    {category}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-blue-950 mb-4">
            Informasi Penting
          </h2>

          <div className="space-y-4">
            <div className="border-l-4 border-yellow-400 bg-yellow-50 rounded-xl p-4">
              <p className="font-semibold text-blue-900">
                Selalu Periksa Pengumuman Secara Berkala
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Mahasiswa disarankan mengecek portal secara rutin agar tidak
                tertinggal informasi akademik dan administrasi.
              </p>
            </div>

            <div className="border-l-4 border-blue-400 bg-blue-50 rounded-xl p-4">
              <p className="font-semibold text-blue-900">
                Gunakan Kategori untuk Mempermudah Pencarian
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Portal ini menyediakan kategori pengumuman agar mahasiswa lebih
                mudah menemukan informasi yang dibutuhkan.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}