# Feature-Sliced Design (FSD) — Инструкция

## Обзор структуры

```
src/
├── app/                    # Точка входа, конфигурация, провайдеры
│   ├── App.tsx            # Корневой компонент с MantineProvider
│   └── router/            # Настройка маршрутов
│
├── pages/                  # Страницы (_views)
│   ├── LoginPage/
│   ├── RegisterPage/
│   └── ForgotPasswordPage/
│
├── widgets/                # Композиции фичей для блоков страницы (пока пусто)
│
├── features/               # Бизнес-логика пользовательских сценариев (пока пусто)
│
├── entities/               # Бизнес-сущности (пока пусто)
│
├── shared/                 # Инфраструктура
│   ├── ui/                # Переиспользуемые UI-компоненты
│   │   └── ColorSchemeToggle/
│   └── lib/               # Утилиты, хелперы, API-конфигурация
│       └── api/           # Централизованные запросы (базовый fetch/axios)
│
├── main.tsx               # Точка входа React
└── theme.ts               # Конфигурация Mantine
```

## Слои (от общего к частному)

| Слой       | Назначение                                      | Можно импортировать из |
|------------|------------------------------------------------|------------------------|
| `app`      | Точка входа, провайдеры, роутинг               | Низзя                  |
| `pages`    | Страницы — одна страница = одна папка          | `pages/...`            |
| `widgets`  | Композиции фичей в блоки (шапка, сайдбар и тд) | `widgets/...`          |
| `features` | Бизнес-действия пользователя (auth, search...) | `features/...`         |
| `entities` | Сущности предметной области (User, Product...) | `entities/...`          |
| `shared`   | Переиспользуемое: UI-компоненты, утилиты       | `shared/...`           |

**Правило зависимостей**: Зависимости идут ТОЛЬКО сверху вниз. `pages` может импортировать из `shared`, `entities`, `features`. `shared` — самый нижний слой, ничего не импортирует.

---

## Как создать новую страницу

### 1. Создай папку в `pages`

```
src/pages/ProductsPage/
├── ProductsPage.tsx        # Компонент страницы
└── index.ts               # Экспорт
```

### 2. Напиши компонент

```tsx
// src/pages/ProductsPage/ProductsPage.tsx
import { Title } from "@mantine/core";

export function ProductsPage() {
  return (
    <div>
      <Title order={2}>Products</Title>
      {/* Контент страницы */}
    </div>
  );
}
```

```ts
// src/pages/ProductsPage/index.ts
export { ProductsPage } from './ProductsPage';
```

### 3. Добавь маршрут

```tsx
// src/app/router/Router.tsx
import { ProductsPage } from "../../pages/ProductsPage";

const router = createBrowserRouter([
  // ...существующие маршруты
  {
    path: "/products",
    element: <ProductsPage />,
  },
]);
```

---

## Как создать переиспользуемый UI-компонент

### 1. Создай папку в `shared/ui`

```
src/shared/ui/Button/
├── Button.tsx
└── index.ts
```

### 2. Напиши компонент

```tsx
// src/shared/ui/Button/Button.tsx
import { Button as MantineButton, ButtonProps } from "@mantine/core";

type Props = ButtonProps & {
  variant?: "primary" | "secondary";
};

export function Button(props: Props) {
  return <MantineButton {...props} />;
}
```

```ts
// src/shared/ui/Button/index.ts
export { Button } from './Button';
```

### 3. Используй

```tsx
import { Button } from "../../shared/ui/Button";
// или через index если есть общий barrel
```

---

## Где делать API-запросы

В FSD нет отдельного слоя `api/`. Запросы распределяются так:

| Куда | Что | Пример |
|------|-----|--------|
| `shared/lib/api/` | Базовый fetch/axios, экземпляр с interceptors | `shared/lib/api/client.ts` |
| `entities/[entity]/model/` | Запросы конкретной сущности | `entities/user/model/user.api.ts` |

### Пример: базовый API-клиент

```ts
// src/shared/lib/api/client.ts
export const apiClient = fetch("/api", {
  headers: { "Content-Type": "application/json" },
}).then((res) => {
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
});
```

### Пример: запросы сущности

```ts
// src/entities/user/model/user.api.ts
import { apiClient } from "../../../shared/lib/api/client";

export async function getUser(id: string) {
  return apiClient(`/users/${id}`);
}

export async function createUser(data: CreateUserDto) {
  return apiClient("/users", { method: "POST", body: JSON.stringify(data) });
}
```

---

## Как создать feature (бизнес-действие)

Фичи — это конкретные пользовательские действия: "войти", "поиск", "добавить в корзину".

### Структура

```
src/features/auth/
├── ui/
│   ├── LoginForm.tsx
│   └── index.ts
├── model/
│   ├── useLogin.ts        # Хук с логикой
│   └── index.ts
└── index.ts               # Публичный экспорт
```

### Пример: LoginForm

```tsx
// src/features/auth/ui/LoginForm.tsx
import { TextInput, PasswordInput, Button } from "@mantine/core";
import { useLogin } from "../model/useLogin";

export function LoginForm() {
  const { mutate, isPending } = useLogin();

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      mutate({ email: e.currentTarget.email.value });
    }}>
      <TextInput name="email" label="Email" required />
      <PasswordInput name="password" label="Password" required />
      <Button type="submit" loading={isPending}>Login</Button>
    </form>
  );
}
```

```ts
// src/features/auth/model/useLogin.ts
import { useMutation } from "@tanstack/react-query";
import { login } from "../../../entities/user/model/user.api";

export function useLogin() {
  return useMutation({
    mutationFn: login,
  });
}
```

```ts
// src/entities/user/model/user.api.ts
import { apiClient } from "../../../shared/lib/api/client";

export async function login(data: { email: string; password: string }) {
  return apiClient("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
```
```

---

## Как создать entity (сущность)

Сущности — это доменные объекты: User, Product, Order.

### Структура

```
src/entities/user/
├── model/
│   ├── user.types.ts      # Типы
│   └── user.api.ts        # API-запросы
└── index.ts
```

```ts
// src/entities/user/model/user.types.ts
export interface User {
  id: string;
  email: string;
  name: string;
}
```

```ts
// src/entities/user/model/user.api.ts
import { apiClient } from "../../../shared/lib/api/client";

export async function getUser(id: string): Promise<User> {
  return apiClient(`/users/${id}`);
}
```

```ts
// src/entities/user/index.ts
export * from "./model/user.types";
export * from "./model/user.api";
```

---

## Рекомендации

### Именование

- Компоненты страниц: `ProductsPage` (суффикс `Page`)
- UI-компоненты: `Button`, `Card`, `Modal`
- Фичи: `auth`, `search`, `cart`
- Сущности: `user`, `product`, `order`

### Barrel-экспорты (index.ts)

Каждая папка должна иметь `index.ts`, который реэкспортирует всё наружу. Это позволяет импортировать так:

```tsx
import { LoginPage } from "../../pages/LoginPage";        // ✓ Хорошо
import { LoginPage } from "../../pages/LoginPage/LoginPage"; // ✗ Можно, но лучше так
```

### Разделение логики и UI

- **UI** — только отображение
- **Логика** — в `model/` папке (хуки, стейт)
- **API** — в `model/` или отдельном `api/` файле

### Импорты

```
// Абсолютные (предпочтительно)
import { Button } from "shared/ui/Button";

// Относительные (тоже ок)
import { Button } from "../../shared/ui/Button";
```

### page vs widget vs feature

| Что           | Когда использовать                                          |
|---------------|-------------------------------------------------------------|
| `page`        | Полная страница по URL                                      |
| `widget`      | Крупный блок страницы (Sidebar, Header, ProductGrid)        |
| `feature`     | Интерактивный элемент с бизнес-логикой (LoginForm, SearchBar) |

### widget vs feature

- **Widget**: не имеет состояния, просто компонует фичи/сущности
- **Feature**: имеет состояние и бизнес-логику

Пример: `Header` — это widget, `SearchBar` — это feature.

---

## Типичный флоу создания фичи

1. Создай `entities/SomeEntity` если доменная модель новая
2. Создай `features/someFeature` с логикой
3. Создай `widgets/someWidget` для композиции
4. Создай `pages/SomePage` которая использует виджеты
5. Добавь роут в `app/router/Router.tsx`

---

## Деплоймент

При сборке (`npm run build`) Vite собирает всё из `src/`. Точка входа — `main.tsx`, который рендерит `App` из `app/`.
