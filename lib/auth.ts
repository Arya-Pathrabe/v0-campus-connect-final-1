export interface User {
  nickname: string
  collegeId: string
  userType: "user" | "vendor"
  isAuthenticated: boolean
}

export const AUTH_STORAGE_KEY = "campusconnect_user"

export function saveUser(user: User): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
  }
}

export function getUser(): User | null {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch {
        return null
      }
    }
  }
  return null
}

export function clearUser(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }
}

export function isValidCollegeId(id: string): boolean {
  // Validate Suryodaya College ID format
  const collegeIdPattern = /^SCET\d{4}$/i
  return collegeIdPattern.test(id)
}
