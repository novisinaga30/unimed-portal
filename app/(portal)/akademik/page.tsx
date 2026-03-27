"use client";

import { useEffect, useMemo, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { getStoredUser } from "@/lib/auth-client";
import type { LoggedInUser } from "@/types/auth";

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

type CourseItem = {
  id: number;
  code: string;
  name: string;
  credits: number;
  lecturer: string;
  semester: string;
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
  course: CourseItem;
};

export default function AkademikPage() {
  const [user, setUser] = useState<LoggedInUser | null>(null);
  const [academics, setAcademics] = useState<AcademicItem[]>([]);
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [krsItems, setKrsItems] = useState<KrsItem[]>([]);

  const [selectedSemester, setSelectedSemester] = useState("1");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const currentUser = getStoredUser();
    setUser(currentUser);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const [academicRes, courseRes, krsRes] = await Promise.all([
          fetch("/api/academics"),
          fetch("/api/courses"),
          fetch("/api/krs"),
        ]);

        const academicJson = await academicRes.json();
        const courseJson = await courseRes.json();
        const krsJson = await krsRes.json();

        if (academicRes.ok) setAcademics(academicJson.data);
        if (courseRes.ok) setCourses(courseJson.data);
        if (krsRes.ok) setKrsItems(krsJson.data);
      } catch (error) {
        console.error(error);
        setErrorMessage("Terjadi kesalahan saat mengambil data akademik");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const myAcademicData = useMemo(() => {
    if (!user) return [];
    return academics.filter((item) => item.userId === user.id);
  }, [academics, user]);

  const myKrsItems = useMemo(() => {
    if (!user) return [];
    return krsItems.filter((item) => item.userId === user.id);
  }, [krsItems, user]);

  const availableCourses = useMemo(() => {
    return courses.filter((course) => course.semester === selectedSemester);
  }, [courses, selectedSemester]);

  async function refreshKrs() {
    const response = await fetch("/api/krs");
    const result = await response.json();
    if (response.ok) setKrsItems(result.data);
  }

  async function handleTakeCourse(courseId: number) {
    if (!user) return;

    setMessage("");
    setErrorMessage("");

    const response = await fetch("/api/krs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user.id,
        courseId,
        semester: selectedSemester,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      setErrorMessage(result.message || "Gagal menambahkan KRS");
      return;
    }

    setMessage("Mata kuliah berhasil ditambahkan ke KRS");
    refreshKrs();
  }

  async function handleDeleteKrs(krsId: number) {
    const confirmed = window.confirm("Yakin ingin menghapus mata kuliah ini dari KRS?");
    if (!confirmed) return;

    const response = await fetch(`/api/krs/${krsId}`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (!response.ok) {
      setErrorMessage(result.message || "Gagal menghapus KRS");
      return;
    }

    setMessage("Mata kuliah berhasil dihapus dari KRS");
    refreshKrs();
  }

  const latestAcademic = myAcademicData.length > 0 ? myAcademicData[0] : null;

  return (
    <>
      <PageHeader
        title="Akademik"
        description="Informasi akademik dan pengisian KRS mahasiswa"
      />

      <section className="max-w-7xl mx-auto px-6 py-8">
        {message && (
          <div className="mb-6 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <p className="text-sm text-gray-500 mb-2">Status KRS</p>
            <h3 className="text-2xl font-bold text-blue-950">
              {latestAcademic?.krsStatus || "-"}
            </h3>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <p className="text-sm text-gray-500 mb-2">SKS</p>
            <h3 className="text-2xl font-bold text-blue-950">
              {latestAcademic?.sks ?? 0}
            </h3>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <p className="text-sm text-gray-500 mb-2">IPS</p>
            <h3 className="text-2xl font-bold text-blue-950">
              {latestAcademic?.ips ?? 0}
            </h3>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <p className="text-sm text-gray-500 mb-2">IPK</p>
            <h3 className="text-2xl font-bold text-blue-950">
              {latestAcademic?.ipk ?? 0}
            </h3>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h2 className="text-xl font-bold text-blue-950">
                Daftar Mata Kuliah
              </h2>

              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="rounded-xl border border-gray-300 px-4 py-2 text-sm"
              >
                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
                <option value="3">Semester 3</option>
                <option value="4">Semester 4</option>
                <option value="5">Semester 5</option>
                <option value="6">Semester 6</option>
                <option value="7">Semester 7</option>
                <option value="8">Semester 8</option>
              </select>
            </div>

            {loading ? (
              <p className="text-gray-600">Memuat mata kuliah...</p>
            ) : availableCourses.length === 0 ? (
              <p className="text-gray-600">Belum ada mata kuliah untuk semester ini.</p>
            ) : (
              <div className="space-y-4">
                {availableCourses.map((course) => (
                  <div key={course.id} className="rounded-xl border border-gray-200 p-4">
                    <p className="font-semibold text-blue-950">
                      {course.code} - {course.name}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {course.credits} SKS • {course.lecturer}
                    </p>
                    <p className="text-sm text-gray-600 mb-3">
                      Semester {course.semester}
                    </p>

                    <button
                      onClick={() => handleTakeCourse(course.id)}
                      className="rounded-lg bg-blue-900 px-4 py-2 text-sm text-white hover:bg-blue-800 transition"
                    >
                      Ambil Mata Kuliah
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-blue-950 mb-4">
              KRS Saya
            </h2>

            {myKrsItems.length === 0 ? (
              <p className="text-gray-600">Belum ada mata kuliah di KRS.</p>
            ) : (
              <div className="space-y-4">
                {myKrsItems.map((item) => (
                  <div key={item.id} className="rounded-xl border border-gray-200 p-4">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <p className="font-semibold text-blue-950">
                          {item.course.code} - {item.course.name}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {item.course.credits} SKS • {item.course.lecturer}
                        </p>
                        <p className="text-sm text-gray-600">
                          Semester {item.semester}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          item.approval === "approved"
                            ? "bg-green-100 text-green-700"
                            : item.approval === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {item.approval}
                      </span>
                    </div>

                    {item.adminNote && (
                      <div className="mb-3 rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-gray-700">
                        <span className="font-semibold">Catatan Admin:</span>{" "}
                        {item.adminNote}
                      </div>
                    )}

                    <button
                      onClick={() => handleDeleteKrs(item.id)}
                      className="rounded-lg bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600 transition"
                    >
                      Hapus dari KRS
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-blue-950 mb-4">
            Riwayat Akademik
          </h2>

          {myAcademicData.length === 0 ? (
            <p className="text-gray-600">Belum ada data akademik.</p>
          ) : (
            <div className="space-y-4">
              {myAcademicData.map((item) => (
                <div key={item.id} className="rounded-xl border border-gray-200 p-4">
                  <p className="font-semibold text-blue-950">
                    Semester {item.semester}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    SKS: {item.sks} • IPS: {item.ips} • IPK: {item.ipk}
                  </p>
                  <p className="text-sm text-gray-600">
                    Status KRS: {item.krsStatus}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}