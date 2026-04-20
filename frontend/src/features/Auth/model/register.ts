import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { registerApi, RegisterCredentials } from "../api/register";
import { ApiException } from "@/shared/lib/api/client";

const russianMessages: Record<string, string> = {
  'имя обязательно': 'Введите имя',
  'фамилия обязательна': 'Введите фамилию',
  'некорректный email': 'Введите корректный email',
  'email обязателен': 'Введите email',
  'пароль должен быть не менее 6 символов': 'Пароль должен быть не менее 6 символов',
  'пароль обязателен': 'Введите пароль',
  'email уже существует': 'Пользователь с таким email уже зарегистрирован',
};

function translateMessage(msg: string): string {
  const lower = msg.toLowerCase();
  for (const [key, value] of Object.entries(russianMessages)) {
    if (lower.includes(key)) {
      return value;
    }
  }
  return msg;
}

export function useRegister() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const registerMutation = useMutation({
    mutationFn: (credentials: RegisterCredentials) =>
      registerApi(credentials).then((response) => {
        localStorage.setItem("access_token", response.access_token);
        localStorage.setItem("refresh_token", response.refresh_token);
        return response;
      }),
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    setErrors({});

    if (password !== confirmPassword) {
      setErrors({ confirmPassword: "Пароли не совпадают" });
      return;
    }

    setLoading(true);
    try {
      await registerMutation.mutateAsync({
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        email: formData.get("email") as string,
        password,
      });
      navigate("/main");
    } catch (error) {
      if (error instanceof ApiException && error.errorData.errors) {
        const translatedErrors: Record<string, string> = {};
        for (const [key, value] of Object.entries(error.errorData.errors)) {
          translatedErrors[key] = translateMessage(value);
        }
        setErrors(translatedErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  return { handleSubmit, loading, errors };
}

export { useRegister as useRegisterForm };
