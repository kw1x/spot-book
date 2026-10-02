# SpotBook

Сервис для бронирования рабочих мест и переговорок в офисе через интерактивную схему этажа.

## Стек технологий

- Java 21, Spring Boot 3.4, Gradle
- PostgreSQL 16 (с btree_gist)
- Liquibase для миграций
- Spring Security + JWT
- React, TypeScript, Vite, Tailwind CSS
- Docker и Docker Compose

## Основные возможности

- Интерактивная карта офиса (SVG): можно кликнуть на стол или комнату, посмотреть параметры и сразу забронировать.
- Цветовые статусы мест: зеленый — свободно, серый — занято на выбранное время, синий — выбранное место.
- Фильтры по времени и типу места (все, только столы, только переговорки).
- Защита от двойного бронирования: проверка на уровне сервиса плюс constraint в PostgreSQL, исключающий наложение интервалов времени.
- Личный кабинет с просмотром и отменой своих броней.
- Админка для добавления и редактирования рабочих мест с координатами на карте.

## Быстрый запуск

Для запуска нужен установленный Docker с Docker Compose.

1. Скопировать пример переменных окружения:
```bash
cp .env.example .env
```

2. Запустить проект:
```bash
docker compose up --build -d
```

После старта:
- Фронтенд: http://localhost:3000
- API бэкенда: http://localhost:8080/api/v1
- Проверка здоровья: http://localhost:8080/actuator/health

## Тестовые учетные записи

Администратор:
- Email: admin@spotbook.com
- Пароль: admin123
- Права: просмотр карты, создание броней, редактирование столов и переговорок в админке

Обычный сотрудник:
- Email: employee@spotbook.com
- Пароль: admin123
- Права: просмотр карты, фильтрация, создание и отмена своих броней

## Основные эндпоинты API

Авторизация:
- POST /api/v1/auth/register — регистрация пользователя
- POST /api/v1/auth/login — вход и получение JWT токена

Рабочие места и карта:
- GET /api/v1/workspaces?floor=1&from=...&to=... — список мест со статусом занятости на выбранный интервал
- GET /api/v1/workspaces/all — список всех мест для админки (нужна роль ROLE_ADMIN)
- GET /api/v1/workspaces/{id} — подробная информация о месте
- POST /api/v1/workspaces — создание нового места с координатами (ROLE_ADMIN)
- PUT /api/v1/workspaces/{id} — редактирование параметров места (ROLE_ADMIN)
- DELETE /api/v1/workspaces/{id} — удаление места (ROLE_ADMIN)

Бронирования:
- POST /api/v1/bookings — создание бронирования
- GET /api/v1/bookings/my — список броней текущего пользователя
- PATCH /api/v1/bookings/{id}/cancel — отмена бронирования

## Локальный запуск без Docker

Бэкенд (требуется Java 21 и запущенный PostgreSQL):
```bash
cd backend
./gradlew test
./gradlew bootRun
```

Фронтенд (требуется Node.js):
```bash
cd frontend
npm install
npm run dev
```
Фронтенд запустится на http://localhost:5173.
