import { useState } from "react";
import { LoginCredentials } from "../api/login";
import { useNavigate } from "react-router-dom";
import { resolve } from "node:dns";

export async function login(credentials: LoginCredentials): Promise<void> {
  localStorage.setItem("token", "temporary-token");
}

export function useLoginForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      await login({
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      });
      navigate("/main");
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return { handleSubmit, loading };
}
