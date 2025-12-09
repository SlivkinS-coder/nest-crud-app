
````markdown

## Установка

1. Установите зависимости:

```bash
npm install
````

2. Создайте файл `.env` в корне проекта и добавьте в него следующие переменные окружения (соответствующие настройкам из `docker-compose`):

```env
JWT_SECRET="ваш_секретный_ключ"
DATABASE_URL="postgresql://postgres:123@localhost:5434/nest"
```

3. Сгенерируйте Prisma клиент:

```bash
npx prisma generate
```

4. Примените миграции:

```bash
npx prisma migrate dev
```

5. Запустите проект:

```bash
npm run start:dev
```

## Запуск E2E тестов

1. Установите зависимости:

```bash
npm install
```

2. Создайте файл `.env.test` и добавьте в него следующие переменные окружения (соответствующие настройкам из `docker-compose`):

```env
JWT_SECRET="ваш_секретный_ключ"
DATABASE_URL="postgresql://postgres:123@localhost:5435/nest"
```

3. Сгенерируйте Prisma клиент:

```bash
npx prisma generate
```

4. Примените миграции для тестовой базы данных:

```bash
npx prisma migrate dev --name test_migrations
```

5. Запустите E2E тесты:

```bash
npm run test:e2e
```

