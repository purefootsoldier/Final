
export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
}

export interface ChangePasswordRequest {
  email: string
  currentPassword: string
  newPassword: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  email: string
  token: string
  newPassword: string
}

export async function registerUser(data: RegisterRequest): Promise<void> {
  const response = await fetch("https://localhost:7233/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || "Error al registrar usuario")
  }
}

export async function loginUser(data: LoginRequest): Promise<LoginResponse> {
  const response = await fetch("https://localhost:7233/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || "Error al iniciar sesión")
  }

  return await response.json()
}

export async function changePassword(data: ChangePasswordRequest): Promise<void> {
  const token = localStorage.getItem("auth_token")

  if (!token) {
    throw new Error("No estás autenticado")
  }

  const response = await fetch("https://localhost:7233/api/auth/change-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || "Error al cambiar la contraseña")
  }
}

export async function forgotPassword(data: ForgotPasswordRequest): Promise<void> {
  const response = await fetch("https://localhost:7233/api/auth/forgot-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || "Error al solicitar recuperación de contraseña")
  }
}

export async function resetPassword(data: ResetPasswordRequest): Promise<void> {
  const response = await fetch("https://localhost:7233/api/auth/reset-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || "Error al restablecer la contraseña")
  }
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem("auth_token")
}

export function getAuthToken(): string | null {
  return localStorage.getItem("auth_token")
}

export function setAuthToken(token: string): void {
  localStorage.setItem("auth_token", token)
}

export function removeAuthToken(): void {
  localStorage.removeItem("auth_token")
}

