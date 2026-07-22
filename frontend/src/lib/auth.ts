import { LoginResponse } from "../types";
import { api } from "./api";


export async function loginRequest(email: string, password: string) {
  const { data } = await api.post<LoginResponse>("/auth/login", {
    email,
    password,
  });
  return data.data;
}

export async function logoutRequest() {
  await api.post("/auth/logout");
}
