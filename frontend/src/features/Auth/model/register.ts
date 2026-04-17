import { useState } from "react";
import { RegisterCredentials } from "../api/register";
import { useNavigate } from "react-router-dom";

export async function register(credentials: RegisterCredentials): Promise<void> {
  localStorage.setItem("token", "temporary-token");
}

export function useRegisterForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      console.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await register({
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        email: formData.get("email") as string,
        password,
      });
      navigate("/main");
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return { handleSubmit, loading };
}
