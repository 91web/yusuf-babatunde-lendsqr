// services/mickyApi.ts
const BASE_URL = "https://run.mocky.io/v3/6d2cc19b-64fd-4955-b069-5e7ae2cc52c8";

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export async function registerUser(data: RegisterPayload) {
  try {
    const res = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    });

    // Check if response has a body
    const text = await res.text();
    const responseData = text ? JSON.parse(text) : {};

    if (!res.ok) {
      if (res.status === 409) {
        throw new Error("Email already exists");
      }
      throw new Error(responseData.message || "Registration failed");
    }

    return responseData;
  } catch (error: any) {
    throw new Error(error.message || "Network error occurred");
  }
}
  

export async function loginUser(data: LoginPayload) {
  try {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error((await res.json()).message || "Login failed");
    return await res.json();
  } catch (error) {
    throw error;
  }
}

export async function resetPassword(email: string) {
  try {
    const res = await fetch(`${BASE_URL}/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) throw new Error((await res.json()).message || "Reset failed");
    return await res.json();
  } catch (error) {
    throw error;
  }
}
