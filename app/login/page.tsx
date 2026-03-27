"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const router = useRouter();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier,
          password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(result.message);
        setLoading(false);
        return;
      }

      // OPTIONAL (masih boleh untuk UI saja)
      localStorage.setItem("user", JSON.stringify(result.data));

      router.push("/dashboard");
    } catch {
      setErrorMessage("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow w-80 space-y-4">
        <h1 className="text-xl font-bold">Login</h1>

        <input
          type="text"
          placeholder="Email / NIM"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className="w-full border p-2"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2"
        />

        {errorMessage && (
          <p className="text-red-500 text-sm">{errorMessage}</p>
        )}

<a
  href="/forgot-password"
  className="text-sm text-blue-600 hover:underline"
>
  Lupa Password?
</a>

        <button className="bg-blue-900 text-white w-full py-2">
          {loading ? "Loading..." : "Login"}
        </button>
      </form>
    </main>
  );
}