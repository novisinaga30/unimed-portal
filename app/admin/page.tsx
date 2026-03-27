"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getStoredUser } from "@/lib/auth-client";
import type { LoggedInUser } from "@/types/auth";
import AdminSummaryCard from "@/components/AdminSummaryCard";
import AdminStatsChart from "@/components/AdminStatsChart";

type AdminUser = {
  id: number;
  fullName: string;
  nim: string;
  email: string;
  role: string;
  photoUrl?: string | null;
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
  user: {
    id: number;
    fullName: string;
    nim: string;
    email: string;
  };
  course: {
    id: number;
    code: string;
    name: string;
    credits: number;
    lecturer: string;
    semester: string;
  };
};

type TabKey = "overview" | "users" | "courses" | "krs";

export default function AdminPage() {
  const [currentUser, setCurrentUser] = useState<LoggedInUser | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("overview");

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [krsItems, setKrsItems] = useState<KrsItem[]>([]);

  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingKrs, setLoadingKrs] = useState(true);

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [editingCourseId, setEditingCourseId] = useState<number | null>(null);
  const [courseCode, setCourseCode] = useState("");
  const [courseName, setCourseName] = useState("");
  const [courseCredits, setCourseCredits] = useState("");
  const [courseLecturer, setCourseLecturer] = useState("");
  const [courseSemester, setCourseSemester] = useState("");

  useEffect(() => {
    const user = getStoredUser();
    setCurrentUser(user);
    fetchUsers();
    fetchCourses();
    fetchKrs();
  }, []);

  async function fetchUsers() {
    try {
      setLoadingUsers(true);
      const response = await fetch("/api/users");
      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(result.message || "Gagal mengambil data user");
        return;
      }

      setUsers(result.data);
    } catch (error) {
      console.error(error);
      setErrorMessage("Terjadi kesalahan saat mengambil data user");
    } finally {
      setLoadingUsers(false);
    }
  }

  async function fetchCourses() {
    try {
      setLoadingCourses(true);
      const response = await fetch("/api/courses");
      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(result.message || "Gagal mengambil mata kuliah");
        return;
      }

      setCourses(result.data);
    } catch (error) {
      console.error(error);
      setErrorMessage("Terjadi kesalahan saat mengambil mata kuliah");
    } finally {
      setLoadingCourses(false);
    }
  }

  async function fetchKrs() {
    try {
      setLoadingKrs(true);
      const response = await fetch("/api/krs");
      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(result.message || "Terjadi kesalahan saat mengambil data KRS");
        return;
      }

      setKrsItems(result.data);
    } catch (error) {
      console.error(error);
      setErrorMessage("Terjadi kesalahan saat mengambil data KRS");
    } finally {
      setLoadingKrs(false);
    }
  }

  const userChartData = useMemo(() => {
    return [
      {
        name: "Admin",
        value: users.filter((item) => item.role === "admin").length,
      },
      {
        name: "Mahasiswa",
        value: users.filter((item) => item.role === "student").length,
      },
    ];
  }, [users]);

  const krsChartData = useMemo(() => {
    return [
      {
        name: "Pending",
        value: krsItems.filter((item) => item.approval === "pending").length,
      },
      {
        name: "Approved",
        value: krsItems.filter((item) => item.approval === "approved").length,
      },
      {
        name: "Rejected",
        value: krsItems.filter((item) => item.approval === "rejected").length,
      },
    ];
  }, [krsItems]);

  const totalCreditsTaken = useMemo(() => {
    return krsItems.reduce((sum, item) => sum + item.course.credits, 0);
  }, [krsItems]);

  async function handleRoleChange(userId: number, newRole: string) {
    try {
      setMessage("");
      setErrorMessage("");

      const targetUser = users.find((item) => item.id === userId);
      if (!targetUser) return;

      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: targetUser.fullName,
          email: targetUser.email,
          role: newRole,
          photoUrl: targetUser.photoUrl || null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(result.message || "Gagal mengubah role");
        return;
      }

      setMessage("Role user berhasil diperbarui");
      fetchUsers();
    } catch (error) {
      console.error(error);
      setErrorMessage("Terjadi kesalahan saat mengubah role");
    }
  }

  async function handleDeleteUser(userId: number) {
    const confirmed = window.confirm("Yakin ingin menghapus user ini?");
    if (!confirmed) return;

    try {
      setMessage("");
      setErrorMessage("");

      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(result.message || "Gagal menghapus user");
        return;
      }

      setMessage("User berhasil dihapus");
      fetchUsers();
      fetchKrs();
    } catch (error) {
      console.error(error);
      setErrorMessage("Terjadi kesalahan saat menghapus user");
    }
  }

  function resetCourseForm() {
    setEditingCourseId(null);
    setCourseCode("");
    setCourseName("");
    setCourseCredits("");
    setCourseLecturer("");
    setCourseSemester("");
  }

  async function handleCourseSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setMessage("");
      setErrorMessage("");

      const payload = {
        code: courseCode,
        name: courseName,
        credits: Number(courseCredits),
        lecturer: courseLecturer,
        semester: courseSemester,
      };

      const response = await fetch(
        editingCourseId ? `/api/courses/${editingCourseId}` : "/api/courses",
        {
          method: editingCourseId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(result.message || "Gagal menyimpan mata kuliah");
        return;
      }

      setMessage(
        editingCourseId
          ? "Mata kuliah berhasil diperbarui"
          : "Mata kuliah berhasil ditambahkan"
      );

      resetCourseForm();
      fetchCourses();
    } catch (error) {
      console.error(error);
      setErrorMessage("Terjadi kesalahan saat menyimpan mata kuliah");
    }
  }

  function handleEditCourse(course: CourseItem) {
    setEditingCourseId(course.id);
    setCourseCode(course.code);
    setCourseName(course.name);
    setCourseCredits(String(course.credits));
    setCourseLecturer(course.lecturer);
    setCourseSemester(course.semester);
    setActiveTab("courses");
    setMessage("");
    setErrorMessage("");
  }

  async function handleDeleteCourse(courseId: number) {
    const confirmed = window.confirm("Yakin ingin menghapus mata kuliah ini?");
    if (!confirmed) return;

    try {
      setMessage("");
      setErrorMessage("");

      const response = await fetch(`/api/courses/${courseId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(result.message || "Gagal menghapus mata kuliah");
        return;
      }

      setMessage("Mata kuliah berhasil dihapus");
      fetchCourses();
      fetchKrs();
    } catch (error) {
      console.error(error);
      setErrorMessage("Terjadi kesalahan saat menghapus mata kuliah");
    }
  }

  async function handleApprovalChange(
    krsId: number,
    approval: string,
    adminNote: string
  ) {
    try {
      setMessage("");
      setErrorMessage("");

      const response = await fetch(`/api/krs/${krsId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          approval,
          adminNote,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(result.message || "Gagal memperbarui validasi KRS");
        return;
      }

      setMessage("Validasi KRS berhasil diperbarui");
      fetchKrs();
    } catch (error) {
      console.error(error);
      setErrorMessage("Terjadi kesalahan saat memperbarui validasi KRS");
    }
  }

  async function handleDeleteKrs(krsId: number) {
    const confirmed = window.confirm("Yakin ingin menghapus data KRS ini?");
    if (!confirmed) return;

    try {
      setMessage("");
      setErrorMessage("");

      const response = await fetch(`/api/krs/${krsId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(result.message || "Gagal menghapus KRS");
        return;
      }

      setMessage("Data KRS berhasil dihapus");
      fetchKrs();
    } catch (error) {
      console.error(error);
      setErrorMessage("Terjadi kesalahan saat menghapus KRS");
    }
  }

  function renderOverview() {
    return (
      <>
        <div className="grid md:grid-cols-5 gap-6 mb-8">
          <AdminSummaryCard label="Total User" value={users.length} />
          <AdminSummaryCard
            label="Total Mahasiswa"
            value={users.filter((item) => item.role === "student").length}
          />
          <AdminSummaryCard
            label="Total Admin"
            value={users.filter((item) => item.role === "admin").length}
          />
          <AdminSummaryCard label="Total Mata Kuliah" value={courses.length} />
          <AdminSummaryCard label="Total SKS Diambil" value={totalCreditsTaken} />
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <AdminStatsChart title="User per Role" data={userChartData} />
          <AdminStatsChart title="Status Validasi KRS" data={krsChartData} />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-blue-950 mb-4">
              Ringkasan Cepat
            </h3>
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                KRS pending:{" "}
                <span className="font-semibold text-yellow-600">
                  {krsItems.filter((item) => item.approval === "pending").length}
                </span>
              </p>
              <p>
                KRS approved:{" "}
                <span className="font-semibold text-green-600">
                  {krsItems.filter((item) => item.approval === "approved").length}
                </span>
              </p>
              <p>
                KRS rejected:{" "}
                <span className="font-semibold text-red-600">
                  {krsItems.filter((item) => item.approval === "rejected").length}
                </span>
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-blue-950 mb-4">
              Aktivitas Admin
            </h3>
            <p className="text-sm text-gray-600">
              Gunakan tab di atas untuk mengelola user, mata kuliah, dan validasi
              KRS mahasiswa.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-blue-950 mb-4">
              Status Sistem
            </h3>
            <p className="text-sm text-green-600 font-semibold">
              Dashboard admin aktif
            </p>
          </div>
        </div>
      </>
    );
  }

  function renderUsers() {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-blue-950 mb-4">Kelola User</h2>

        {loadingUsers ? (
          <p className="text-gray-600">Memuat data user...</p>
        ) : users.length === 0 ? (
          <p className="text-gray-600">Belum ada user.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="py-3 pr-4 text-sm font-semibold text-gray-700">ID</th>
                  <th className="py-3 pr-4 text-sm font-semibold text-gray-700">Nama</th>
                  <th className="py-3 pr-4 text-sm font-semibold text-gray-700">NIM</th>
                  <th className="py-3 pr-4 text-sm font-semibold text-gray-700">Email</th>
                  <th className="py-3 pr-4 text-sm font-semibold text-gray-700">Role</th>
                  <th className="py-3 pr-4 text-sm font-semibold text-gray-700">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {users.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="py-4 pr-4 text-sm text-gray-700">{item.id}</td>
                    <td className="py-4 pr-4 text-sm text-gray-700">{item.fullName}</td>
                    <td className="py-4 pr-4 text-sm text-gray-700">{item.nim}</td>
                    <td className="py-4 pr-4 text-sm text-gray-700">{item.email}</td>
                    <td className="py-4 pr-4">
                      <select
                        value={item.role}
                        onChange={(e) => handleRoleChange(item.id, e.target.value)}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                      >
                        <option value="student">student</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                    <td className="py-4 pr-4">
                      <button
                        onClick={() => handleDeleteUser(item.id)}
                        className="rounded-lg bg-red-500 px-3 py-2 text-sm text-white hover:bg-red-600 transition"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  function renderCourses() {
    return (
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="text-xl font-bold text-blue-950">
              {editingCourseId ? "Edit Mata Kuliah" : "Tambah Mata Kuliah"}
            </h2>

            {editingCourseId && (
              <button
                onClick={resetCourseForm}
                className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                Batal
              </button>
            )}
          </div>

          <form onSubmit={handleCourseSubmit} className="space-y-4">
            <input
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              placeholder="Kode mata kuliah"
              className="w-full border border-gray-300 rounded-xl px-4 py-3"
            />
            <input
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              placeholder="Nama mata kuliah"
              className="w-full border border-gray-300 rounded-xl px-4 py-3"
            />
            <input
              value={courseCredits}
              onChange={(e) => setCourseCredits(e.target.value)}
              placeholder="SKS"
              className="w-full border border-gray-300 rounded-xl px-4 py-3"
            />
            <input
              value={courseLecturer}
              onChange={(e) => setCourseLecturer(e.target.value)}
              placeholder="Dosen pengampu"
              className="w-full border border-gray-300 rounded-xl px-4 py-3"
            />
            <input
              value={courseSemester}
              onChange={(e) => setCourseSemester(e.target.value)}
              placeholder="Semester"
              className="w-full border border-gray-300 rounded-xl px-4 py-3"
            />

            <button className="rounded-xl bg-green-600 px-5 py-3 text-sm font-medium text-white hover:bg-green-700 transition">
              {editingCourseId ? "Simpan Perubahan" : "Tambah Mata Kuliah"}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-blue-950 mb-4">
            Daftar Mata Kuliah
          </h2>

          {loadingCourses ? (
            <p className="text-gray-600">Memuat mata kuliah...</p>
          ) : courses.length === 0 ? (
            <p className="text-gray-600">Belum ada mata kuliah.</p>
          ) : (
            <div className="space-y-4 max-h-[650px] overflow-auto pr-2">
              {courses.map((course) => (
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

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEditCourse(course)}
                      className="rounded-lg bg-yellow-500 px-3 py-2 text-sm text-white hover:bg-yellow-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      className="rounded-lg bg-red-500 px-3 py-2 text-sm text-white hover:bg-red-600 transition"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  function renderKrs() {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-blue-950 mb-4">
          Validasi KRS Mahasiswa
        </h2>

        {loadingKrs ? (
          <p className="text-gray-600">Memuat data KRS...</p>
        ) : krsItems.length === 0 ? (
          <p className="text-gray-600">Belum ada data KRS.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1300px] border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="py-3 pr-4 text-sm font-semibold text-gray-700">Mahasiswa</th>
                  <th className="py-3 pr-4 text-sm font-semibold text-gray-700">NIM</th>
                  <th className="py-3 pr-4 text-sm font-semibold text-gray-700">Kode MK</th>
                  <th className="py-3 pr-4 text-sm font-semibold text-gray-700">Mata Kuliah</th>
                  <th className="py-3 pr-4 text-sm font-semibold text-gray-700">SKS</th>
                  <th className="py-3 pr-4 text-sm font-semibold text-gray-700">Semester</th>
                  <th className="py-3 pr-4 text-sm font-semibold text-gray-700">Approval</th>
                  <th className="py-3 pr-4 text-sm font-semibold text-gray-700">Catatan Admin</th>
                  <th className="py-3 pr-4 text-sm font-semibold text-gray-700">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {krsItems.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 align-top">
                    <td className="py-4 pr-4 text-sm text-gray-700">{item.user.fullName}</td>
                    <td className="py-4 pr-4 text-sm text-gray-700">{item.user.nim}</td>
                    <td className="py-4 pr-4 text-sm text-gray-700">{item.course.code}</td>
                    <td className="py-4 pr-4 text-sm text-gray-700">{item.course.name}</td>
                    <td className="py-4 pr-4 text-sm text-gray-700">{item.course.credits}</td>
                    <td className="py-4 pr-4 text-sm text-gray-700">{item.semester}</td>
                    <td className="py-4 pr-4">
                      <select
                        value={item.approval}
                        onChange={(e) =>
                          handleApprovalChange(
                            item.id,
                            e.target.value,
                            item.adminNote || ""
                          )
                        }
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                      >
                        <option value="pending">pending</option>
                        <option value="approved">approved</option>
                        <option value="rejected">rejected</option>
                      </select>
                    </td>
                    <td className="py-4 pr-4">
                      <input
                        defaultValue={item.adminNote || ""}
                        placeholder="Catatan admin"
                        className="w-[200px] rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        onBlur={(e) =>
                          handleApprovalChange(
                            item.id,
                            item.approval,
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td className="py-4 pr-4">
                      <button
                        onClick={() => handleDeleteKrs(item.id)}
                        className="rounded-lg bg-red-500 px-3 py-2 text-sm text-white hover:bg-red-600 transition"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <header className="bg-blue-950 text-white">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <p className="text-sm text-blue-200 mb-1">Admin Panel</p>
          <h1 className="text-3xl font-bold">Dashboard Admin Profesional</h1>
          <p className="text-blue-100 mt-2">
            Selamat datang, {currentUser?.fullName || "Admin"}
          </p>
        </div>
      </header>

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

        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setActiveTab("overview")}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              activeTab === "overview"
                ? "bg-blue-900 text-white"
                : "bg-white text-blue-900 border border-blue-200 hover:bg-blue-50"
            }`}
          >
            Overview
          </button>

          <button
            onClick={() => setActiveTab("users")}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              activeTab === "users"
                ? "bg-blue-900 text-white"
                : "bg-white text-blue-900 border border-blue-200 hover:bg-blue-50"
            }`}
          >
            User
          </button>

          <button
            onClick={() => setActiveTab("courses")}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              activeTab === "courses"
                ? "bg-blue-900 text-white"
                : "bg-white text-blue-900 border border-blue-200 hover:bg-blue-50"
            }`}
          >
            Mata Kuliah
          </button>

          <button
            onClick={() => setActiveTab("krs")}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              activeTab === "krs"
                ? "bg-blue-900 text-white"
                : "bg-white text-blue-900 border border-blue-200 hover:bg-blue-50"
            }`}
          >
            Validasi KRS
          </button>
        </div>

        {activeTab === "overview" && renderOverview()}
        {activeTab === "users" && renderUsers()}
        {activeTab === "courses" && renderCourses()}
        {activeTab === "krs" && renderKrs()}

        <div className="mt-8 flex gap-4">
          <Link
            href="/dashboard"
            className="rounded-xl bg-blue-900 px-5 py-3 text-white font-medium hover:bg-blue-800 transition"
          >
            Ke Dashboard Mahasiswa
          </Link>

          <Link
            href="/profil"
            className="rounded-xl border border-blue-900 px-5 py-3 text-blue-900 font-medium hover:bg-blue-50 transition"
          >
            Lihat Profil
          </Link>
        </div>
      </section>
    </main>
  );
}