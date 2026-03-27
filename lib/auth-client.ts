import type { LoggedInUser } from "@/types/auth";

export function getStoredUser(): LoggedInUser | null {
  if (typeof window === "undefined") return null;

  const storedUser = localStorage.getItem("user");

  if (!storedUser) return null;

  try {
    return JSON.parse(storedUser) as LoggedInUser;
  } catch (error) {
    console.error("Failed to parse stored user:", error);
    localStorage.removeItem("user");
    return null;
  }
}