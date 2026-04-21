# Тесты Frontend

Тесты написаны на **Vitest** + **Testing Library**. Запуск: `npm run vitest` (один раз) или `npm run vitest:watch` (с авто-перезапуском).

---

## Структура тестов

```
src/
├── features/Auth/
│   ├── api/
│   │   ├── login.spec.ts      — тесты API-функции входа
│   │   └── register.spec.ts   — тесты API-функции регистрации
│   └── model/
│       ├── login.spec.tsx     — тесты хука useLogin (бизнес-логика)
│       └── register.spec.tsx  — тесты хука useRegister (бизнес-логика)
├── pages/
│   ├── LoginPage/
│   │   └── LoginPage.spec.tsx — тесты страницы входа
│   ├── RegisterPage/
│   │   └── RegisterPage.spec.tsx — тесты страницы регистрации
│   ├── MainPage/
│   │   └── MainPage.spec.tsx — тесты главной страницы (редирект)
│   ├── ProfilePage/
│   │   └── ProfilePage.spec.tsx — тесты страницы профиля
│   ├── SettingsPage/
│   │   └── SettingsPage.spec.tsx — тесты страницы настроек
│   ├── ForgotPasswordPage/
│   │   └── ForgotPasswordPage.spec.tsx — тесты страницы восстановления пароля
│   └── DashboardPage/
│       ├── DashboardPage.spec.tsx — тесты страницы дашборда
│       └── ui/
│           └── AccountsPage.spec.tsx — тесты страницы счетов
├── shared/ui/
│   ├── IconRenderer/
│   │   ├── IconRenderer.spec.tsx — тесты компонента иконок
│   │   └── IconSelector.spec.tsx — тесты селектора иконок
│   └── ColorSchemeToggle/
│       └── ColorSchemeToggle.spec.tsx — тесты переключателя темы
└── widgets/
    ├── MainLayout/
    │   └── MainLayout.spec.tsx — тесты главного макета
    ├── CategoryAccordion/
    │   └── ui/
    │       └── CategoryAccordion.spec.tsx — тесты аккордеона категорий
    └── SubCategoryCard/
        └── ui/
            └── SubCategoryCard.spec.tsx — тесты карточки подкатегории
```

---

## API-тесты (`features/Auth/api/`)

### `login.spec.ts`

Тестирует функцию `loginApi`, которая отправляет POST-запрос на `/auth/login`.

| Тест | Что делает |
|---|---|
| `should call apiClient with correct endpoint and credentials` | Проверяет, что при вызове `loginApi` с правильными данными, `apiClient` вызывается с эндпоинтом `/auth/login`, методом `POST` и телом запроса с email и password |
| `should throw ApiException on error response` | Проверяет, что если API возвращает ошибку, функция выбрасывает исключение `ApiException` |
| `should return tokens on successful login` | Проверяет, что при успешном ответе возвращаются `access_token` и `refresh_token` |

### `register.spec.ts`

Тестирует функцию `registerApi`, которая отправляет POST-запрос на `/auth/register`.

| Тест | Что делает |
|---|---|
| `should call apiClient with correct endpoint and credentials` | Проверяет, что `registerApi` вызывает `apiClient` с эндпоинтом `/auth/register`, методом `POST` и телом с firstName, lastName, email, password |
| `should throw ApiException on error response` | Проверяет, что при ошибке (например, email уже существует) выбрасывается `ApiException` |
| `should return tokens on successful registration` | Проверяет, что при успешной регистрации возвращаются токены |

**Как работают API-тесты:** они мокают `apiClient` — реальный HTTP-запрос не отправляется. Вместо этого `apiClient` подменяется на `vi.fn()`, и через `mockResolvedValueOnce` / `mockRejectedValueOnce` ему задаётся конкретный ответ.

---

## Тесты бизнес-логики (`features/Auth/model/`)

### `login.spec.tsx`

Тестирует хук `useLogin` — содержит бизнес-логику входа (валидация, запрос к API, сохранение токенов).

| Тест | Что делает |
|---|---|
| `should navigate to /main on successful login` | После успешного входа проверяет, что `navigate` вызван с `/main` |
| `should set tokens in localStorage on successful login` | После успешного входа проверяет, что `access_token` и `refresh_token` сохранены в localStorage |
| `should set errors on API exception with errors` | Если API вернул ошибку с полем `errors`, проверяет, что в состоянии хука появились эти ошибки |
| `should not set errors when API exception has no errors` | Если API вернул общую ошибку без поля `errors`, проверяет, что состояние ошибок остаётся пустым `{}` |
| `should be false initially (loading)` | Проверяет, что при создании хука `loading = false` |
| `should be empty object initially (errors)` | Проверяет, что при создании хука `errors = {}` |

### `register.spec.tsx`

Тестирует хук `useRegister` — бизнес-логика регистрации.

| Тест | Что делает |
|---|---|
| `should set confirmPassword error when passwords do not match` | Если пользователь ввёл разные пароли, проверяет, что ошибка `confirmPassword` установлена в состояние |
| `should navigate to /main on successful registration` | После успешной регистрации проверяет переход на `/main` |
| `should set tokens in localStorage on successful registration` | Проверяет сохранение токенов в localStorage |
| `should translate Russian error messages from API` | Проверяет перевод ошибки с русского (`email уже существует`) на человекочитаемый текст (`Пользователь с таким email уже зарегистрирован`) |
| `should not call API when passwords do not match` | Если пароли не совпадают, API не вызывается вообще |
| `should be false initially (loading)` | Проверяет начальное состояние `loading = false` |
| `should be empty object initially (errors)` | Проверяет начальное состояние `errors = {}` |

**Как работают тесты хуков:** создаётся тестовый компонент с формой, которая вызывает `handleSubmit` из хука. React Query оборачивается в `QueryClientProvider` с отключёнными retry. Навигация мокается через `useNavigate`.

---

## Тесты страниц (`pages/`)

### `LoginPage.spec.tsx`

Тестирует страницу входа — чисто рендер (без бизнес-логики).

| Тест | Что делает |
|---|---|
| `renders login form with email and password fields` | Проверяет наличие полей email, password и кнопки Login |
| `renders "Welcome back!" title` | Проверяет заголовок страницы |
| `renders "Forgot password?" link` | Проверяет ссылку на восстановление пароля |
| `renders "Register" link` | Проверяет ссылку на страницу регистрации |
| `renders "Remember me" checkbox` | Проверяет чекбокс "Запомнить меня" |
| `renders theme toggle button` | Проверяет наличие кнопки переключения темы |
| `displays error message when errors.general is present` | Проверяет отображение общей ошибки |
| `displays email field error` | Проверяет отображение ошибки валидации email |
| `displays password field error` | Проверяет отображение ошибки валидации пароля |
| `shows loading state on submit button` | Проверяет, что при `loading=true` кнопка показывает `aria-busy="true"` |
| `calls handleSubmit when form is submitted` | Проверяет, что при отправке формы вызывается `handleSubmit` |

### `RegisterPage.spec.tsx`

Тестирует страницу регистрации.

| Тест | Что делает |
|---|---|
| `renders registration form with all fields` | Проверяет наличие всех 6 полей: firstName, lastName, email, password, confirmPassword и кнопки Register |
| `renders "Create account" title` | Проверяет заголовок |
| `renders "Login" link` | Проверяет ссылку на страницу входа |
| `renders theme toggle button` | Проверяет кнопку темы |
| `displays general error message` | Проверяет общую ошибку |
| `displays firstName/lastName/email/password/confirmPassword field error` | Проверяет отображение ошибок для каждого поля |
| `shows loading state on submit button` | Проверяет `aria-busy` на кнопке |
| `calls handleSubmit when form is submitted` | Проверяет вызов `handleSubmit` при отправке |

### `MainPage.spec.tsx`

Тестирует главную страницу (редирект на дашборд).

| Тест | Что делает |
|---|---|
| `renders Navigate component` | Проверяет наличие компонента навигации |
| `navigates to /main/dashboard` | Проверяет, что редирект идёт на `/main/dashboard` |
| `uses replace navigation` | Проверяет использование `replace` вместо `push` |

### `ProfilePage.spec.tsx`

Тестирует страницу профиля пользователя.

| Тест | Что делает |
|---|---|
| `renders profile title` | Проверяет заголовок "Profile" |
| `renders profile description` | Проверяет описание профиля |
| `renders user name` | Проверяет отображение имени "John Doe" |
| `renders user email` | Проверяет отображение email |
| `renders avatar` | Проверяет отображение аватара с инициалами "JD" |

### `SettingsPage.spec.tsx`

Тестирует страницу настроек.

| Тест | Что делает |
|---|---|
| `renders settings title` | Проверяет заголовок "Settings" |
| `renders settings description` | Проверяет описание настроек |
| `renders appearance section` | Проверяет секцию "Appearance" |
| `renders dark mode switch` | Проверяет переключатель тёмной темы |
| `renders notifications section` | Проверяет секцию "Notifications" |
| `renders email notifications switch` | Проверяет переключатель email-уведомлений |
| `renders push notifications switch` | Проверяет переключатель push-уведомлений |

### `ForgotPasswordPage.spec.tsx`

Тестирует страницу восстановления пароля.

| Тест | Что делает |
|---|---|
| `renders forgot password title` | Проверяет заголовок |
| `renders email input` | Проверяет поле ввода email |
| `renders send reset link button` | Проверяет кнопку отправки |
| `renders back to login link` | Проверяет ссылку на страницу входа |
| `renders description text` | Проверяет текст с инструкциями |

### `DashboardPage.spec.tsx`

Тестирует страницу дашборда с табами.

| Тест | Что делает |
|---|---|
| `renders dashboard title` | Проверяет заголовок "Dashboard" |
| `renders welcome text` | Проверяет приветственный текст |
| `renders tab 1 button` | Проверяет наличие кнопки Tab 1 |
| `renders tab 2 button` | Проверяет наличие кнопки Tab 2 |
| `renders tab 1 content by default` | Проверяет контент Tab 1 по умолчанию |

### `AccountsPage.spec.tsx`

Тестирует страницу управления счетами.

| Тест | Что делает |
|---|---|
| `renders page title` | Проверяет заголовок "Счета" |
| `renders "Новый счёт" button` | Проверяет кнопку создания нового счёта |
| `renders empty state when no accounts` | Проверяет сообщение при отсутствии счетов |
| `renders total balance section` | Проверяет секцию общего баланса |

---

## Тесты компонентов (`shared/ui/`)

### `IconRenderer.spec.tsx`

Тестирует компонент отображения иконок.

| Тест | Что делает |
|---|---|
| `renders icon by name` | Проверяет рендер иконки по имени |
| `renders icon with custom size` | Проверяет рендер иконки с кастомным размером |
| `renders default icon (plus) for unknown name` | Проверяет, что для неизвестного имени показывается иконка "plus" |
| `renders each icon from AVAILABLE_ICONS` | Проверяет, что все иконки из AVAILABLE_ICONS рендерятся |
| `contains at least 10 icons` | Проверяет, что в AVAILABLE_ICONS более 10 иконок |
| `each icon has name and component` | Проверяет структуру каждой иконки |
| `has expected common icons` | Проверяет наличие основных иконок (home, car, wallet) |

### `IconSelector.spec.tsx`

Тестирует компонент выбора иконки.

| Тест | Что делает |
|---|---|
| `renders icon selector with icons` | Проверяет рендер селектора иконок |
| `calls onChange when icon is clicked` | Проверяет вызов `onChange` при клике на иконку |
| `shows pagination when there are more icons than ICONS_PER_PAGE (20)` | Проверяет пагинацию при большом количестве иконок |
| `renders icons in a grid` | Проверяет отображение иконок в сетке |

### `ColorSchemeToggle.spec.tsx`

Тестирует компонент переключения цветовой схемы.

| Тест | Что делает |
|---|---|
| `renders light, dark, and auto buttons` | Проверяет наличие трёх кнопок выбора темы |
| `has three buttons` | Проверяет, что всего три кнопки |

---

## Тесты виджетов (`widgets/`)

### `MainLayout.spec.tsx`

Тестирует главный макет приложения.

| Тест | Что делает |
|---|---|
| `renders AppShell` | Проверяет рендер AppShell |
| `renders Outlet for nested routes` | Проверяет наличие Outlet для вложенных маршрутов |
| `renders sidebar navigation items` | Проверяет навигационные элементы сайдбара |
| `renders logout button` | Проверяет кнопку выхода |
| `renders burger menu` | Проверяет бургер-меню |
| `clears tokens and navigates to / on logout` | Проверяет очистку токенов и переход на главную при выходе |

### `CategoryAccordion.spec.tsx`

Тестирует аккордеон категорий.

| Тест | Что делает |
|---|---|
| `renders category name` | Проверяет отображение названия категории |
| `renders category icon` | Проверяет отображение иконки категории |
| `renders accordion control` | Проверяет рендер контрола аккордеона |

### `SubCategoryCard.spec.tsx`

Тестирует карточку подкатегории.

| Тест | Что делает |
|---|---|
| `renders subcategory name` | Проверяет отображение названия подкатегории |
| `renders icon` | Проверяет отображение иконки подкатегории |

---

## Ключевые концепции в тестах

- **Моки** — `vi.mock()` подменяет модули. В API-тестах мокается `apiClient`, в тестах страниц — компоненты UI и хуки
- **Spy-функции** — `vi.fn()` создаёт пустую функцию, которую можно отслеживать: проверять, была ли она вызвана, с какими аргументами
- **`mockResolvedValueOnce`** — задаёт результат, который асинхронная функция вернёт при следующем вызове
- **`mockRejectedValueOnce`** — задаёт ошибку, которую функция выбросит
- **`waitFor`** — асинхронный хелпер, ждёт выполнения условия (нужен для состояний, которые обновляются после async операций)
- **`act()`** — оборачивает асинхронные операции, чтобы React корректно обработал все обновления состояния

---

## E2E Тесты (Playwright)

E2E тесты находятся в папке `e2e/` и запускаются через `npm run e2e`.

### Структура E2E тестов

```
e2e/
├── auth.spec.ts      — тесты страниц авторизации
└── dashboard.spec.ts — тесты дашборда и навигации
```

### `auth.spec.ts`

Тесты страниц входа, регистрации и восстановления пароля.

| Тест | Что делает |
|------|-------------|
| `login page renders correctly` | Проверяет рендер страницы входа: заголовок, поля email/password, кнопка Login, ссылки |
| `login page has correct links` | Проверяет href ссылок Register и Forgot password |
| `navigates to register page` | Кликает на Register и проверяет переход на `/register` |
| `navigates to forgot password page` | Кликает на Forgot password и проверяет переход |
| `register page renders correctly` | Проверяет рендер страницы регистрации со всеми 6 полями |
| `register page has login link` | Проверяет ссылку Login |
| `forgot password page renders correctly` | Проверяет рендер страницы восстановления пароля |
| `theme toggle button exists on login page` | Проверяет наличие кнопки переключения темы |

### `dashboard.spec.ts`

Тесты дашборда, навигации и страниц профиля/настроек.

| Тест | Что делает |
|------|-------------|
| `redirects to /main/dashboard when already logged in and visiting /` | Проверяет авто-редирект при наличии токена |
| `profile page renders correctly` | Проверяет рендер страницы профиля с именем |
| `settings page renders correctly` | Проверяет рендер страницы настроек с секциями Appearance и Notifications |
| `main page redirects to dashboard` | Проверяет редирект `/main` → `/main/dashboard` |

### Запуск E2E тестов

```bash
# Установить Playwright (один раз)
npm install --save-dev @playwright/test
npx playwright install chromium

# Запустить E2E тесты
npm run e2e

# Или с UI для отладки
npm run e2e:ui
```

### Особенности

- E2E тесты используют реальный браузер (Chromium)
- localStorage очищается между тестами через `page.evaluate()`
- Для доступа к дашборду в тестах искусственно устанавливается токен в localStorage
- Тесты проверяют реальное поведение UI, а не моков

---

## Статистика тестов

- **18 юнит-тестовых файлов** (Vitest)
- **95 юнит-тестов** (все проходят)
- **2 E2E файла** (Playwright)
- **12 E2E тестов** (все проходят)

### Покрытие компонентов (юнит-тесты)

| Категория | Проверено | Всего |
|-----------|-----------|-------|
| Auth API | 2/2 | 100% |
| Auth Model/Hooks | 2/2 | 100% |
| Pages (Auth) | 2/2 | 100% |
| Pages (Other) | 6/6 | 100% |
| Shared UI | 3/3 | 100% |
| Widgets | 3/3 | 100% |