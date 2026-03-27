"use client";

import { FormEvent, useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { getStoredUser } from "@/lib/auth-client";
import type { LoggedInUser } from "@/types/auth";

export default function ProfilPage() {
  const [user, setUser] = useState<LoggedInUser | null>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const currentUser = getStoredUser();
    setUser(currentUser);

    if (currentUser) {
      setFullName(currentUser.fullName);
      setEmail(currentUser.email);
      setPhotoUrl(currentUser.photoUrl || "");
    }
  }, []);

  async function handleUploadPhoto() {
    if (!selectedPhoto) {
      setErrorMessage("Pilih file foto terlebih dahulu");
      return;
    }

    setIsUploadingPhoto(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const formData = new FormData();
      formData.append("file", selectedPhoto);

      const response = await fetch("/api/upload-profile-photo", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(result.message || "Gagal upload foto");
        return;
      }

      setPhotoUrl(result.data.url);
      setSuccessMessage("Foto berhasil diupload. Jangan lupa simpan profil.");
    } catch (error) {
      console.error("Upload photo error:", error);
      setErrorMessage("Terjadi kesalahan saat upload foto");
    } finally {
      setIsUploadingPhoto(false);
    }
  }

  async function handleSaveProfile(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!user) return;

    setIsSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          photoUrl,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(result.message || "Gagal memperbarui profil");
        return;
      }

      localStorage.setItem("user", JSON.stringify(result.data));
      setUser(result.data);
      setSuccessMessage("Profil berhasil diperbarui");
      setIsEditing(false);
      setSelectedPhoto(null);
    } catch (error) {
      console.error("Update profile error:", error);
      setErrorMessage("Terjadi kesalahan koneksi");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleChangePassword(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;

    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch(`/api/users/${user.id}/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(result.message);
        return;
      }

      setSuccessMessage("Password berhasil diubah");
      setCurrentPassword("");
      setNewPassword("");
      setShowPasswordForm(false);
    } catch {
      setErrorMessage("Terjadi kesalahan");
    }
  }

  return (
    <>
      <PageHeader
        title="Profil Mahasiswa"
        description="Kelola akun dan foto profil"
      />

      <section className="max-w-5xl mx-auto px-6 py-8">
        <div className="bg-gradient-to-r from-blue-950 to-blue-800 text-white rounded-3xl p-8 mb-8 flex flex-col md:flex-row md:items-center gap-6">
          {user?.photoUrl ? (
            <img
              src={user.photoUrl}
              alt={user.fullName}
              className="w-24 h-24 rounded-full object-cover border-4 border-white/30"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-white/20 border-4 border-white/20 flex items-center justify-center text-3xl font-bold">
              {user?.fullName?.charAt(0).toUpperCase() || "M"}
            </div>
          )}

          <div>
            <p className="text-blue-100 mb-2">Data Mahasiswa</p>
            <h2 className="text-3xl font-bold mb-2">
              {user?.fullName || "Mahasiswa"}
            </h2>
            <p className="text-blue-100">
              NIM: {user?.nim || "-"} • {user?.email || "-"}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 mb-8">
          {errorMessage && (
            <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-600">
              {successMessage}
            </div>
          )}

          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="text-xl font-bold text-blue-950">
              Informasi Profil
            </h2>

            <button
              onClick={() => {
                setIsEditing((prev) => !prev);
                setErrorMessage("");
                setSuccessMessage("");
                if (user) {
                  setFullName(user.fullName);
                  setEmail(user.email);
                  setPhotoUrl(user.photoUrl || "");
                }
                setSelectedPhoto(null);
              }}
              className="rounded-xl bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 transition"
            >
              {isEditing ? "Batal" : "Edit Profil"}
            </button>
          </div>

          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-500 mb-2">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-gray-500 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-gray-500 mb-2">
                  Upload Foto Profil
                </label>

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setSelectedPhoto(file);
                  }}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3"
                />

                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleUploadPhoto}
                    disabled={isUploadingPhoto}
                    className="rounded-xl bg-yellow-500 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-600 transition disabled:opacity-60"
                  >
                    {isUploadingPhoto ? "Uploading..." : "Upload Foto"}
                  </button>

                  <p className="text-xs text-gray-500">
                    Format: JPG, PNG, WEBP • Maksimal 2MB
                  </p>
                </div>
              </div>

              <div className="md:col-span-2">
                <p className="text-sm text-gray-500 mb-2">Preview Foto</p>
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt="Preview foto"
                    className="w-24 h-24 rounded-full object-cover border border-gray-200"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400">
                    No Photo
                  </div>
                )}
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">NIM</p>
                <p className="font-semibold text-blue-900">{user?.nim || "-"}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Role</p>
                <p className="font-semibold text-green-600">
                  {user?.role || "-"}
                </p>
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-xl bg-green-600 px-5 py-3 text-sm font-medium text-white hover:bg-green-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Nama Lengkap</p>
                <p className="font-semibold text-blue-900">
                  {user?.fullName || "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">NIM</p>
                <p className="font-semibold text-blue-900">{user?.nim || "-"}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Email</p>
                <p className="font-semibold text-blue-900">
                  {user?.email || "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Role</p>
                <p className="font-semibold text-green-600">
                  {user?.role || "-"}
                </p>
              </div>

              <div className="md:col-span-2">
                <p className="text-sm text-gray-500 mb-1">Foto Profil</p>
                {user?.photoUrl ? (
                  <img
                    src={user.photoUrl}
                    alt={user.fullName}
                    className="w-24 h-24 rounded-full object-cover border border-gray-200"
                  />
                ) : (
                  <p className="font-semibold text-gray-400">Belum ada foto</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="text-xl font-bold text-blue-950">
              Ubah Password
            </h2>

            <button
              onClick={() => setShowPasswordForm((prev) => !prev)}
              className="rounded-xl bg-yellow-500 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-600 transition"
            >
              {showPasswordForm ? "Tutup" : "Ubah Password"}
            </button>
          </div>

          {showPasswordForm && (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <input
                type="password"
                placeholder="Password Lama"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-900"
              />

              <input
                type="password"
                placeholder="Password Baru"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-900"
              />

              <button className="bg-green-600 text-white px-4 py-3 rounded-xl font-medium hover:bg-green-700 transition">
                Simpan Password
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}