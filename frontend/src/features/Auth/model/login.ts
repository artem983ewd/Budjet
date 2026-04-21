import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { loginApi, LoginCredentials } from "../api/login";
import { ApiException } from "@/shared/lib/api/client";

export function useLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      loginApi(credentials).then((response) => {
        localStorage.setItem("access_token", response.access_token);
        localStorage.setItem("refresh_token", response.refresh_token);
        return response;
      }),
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    setErrors({});
    setLoading(true);
    try {
      await loginMutation.mutateAsync({
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      });
      navigate("/main");
    } catch (error) {
      if (error instanceof ApiException && error.errorData.errors) {
        setErrors(error.errorData.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  return { handleSubmit, loading, errors };
}

export { useLogin as useLoginForm };
