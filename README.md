# 🎬 OMDb Movie Search

Полнофункциональное веб-приложение для поиска фильмов, сериалов и эпизодов с использованием OMDb API. Построено на React Remix с TypeScript для максимальной производительности и SEO-оптимизации.

## ⚡ Быстрый старт

### 1. Клонирование репозитория

```bash
git clone https://github.com/doc2288/omdb-movie-search.git
cd omdb-movie-search
```

### 2. Установка зависимостей

```bash
npm install
```

### 3. Настройка переменных окружения

Создайте файл `.env` в корне проекта:

```bash
cp .env.example .env
```

Откройте `.env` и добавьте ваш API ключ:

```env
OMDB_API_KEY=bcb42103
NODE_ENV=development
PORT=3000
```

### 4. Запуск в режиме разработки

```bash
npm run dev
```

Приложение будет доступно по адресу: **http://localhost:3000**

## 🚀 Возможности

- 🔍 **Поиск по названию** с debounce (300мс)
- 🎥 **Фильтрация по типу**: фильмы, сериалы, эпизоды
- 📅 **Фильтрация по году** выпуска
- 🎭 **Фильтрация по жанру** с умной загрузкой
- 📊 **Пагинация** результатов
- ⚡ **Server-side rendering** для SEO
- 💾 **LRU кэширование** (10 минут)
- 📱 **Адаптивный дизайн**
- 🔒 **Безопасность API ключей**

## 📋 Требования

- **Node.js**: версия 18+
- **npm** или **yarn**
- **OMDb API ключ** (бесплатный)

## 🏗️ Команды

```bash
# Разработка
npm run dev

# Сборка
npm run build

# Продакшен
npm start

# Линтинг
npm run lint

# Форматирование
npm run format
```

## 🔧 Технологии

- 🌐 **Remix** v2 + React 18+
- 🔷 **TypeScript**
- 🎨 **Tailwind CSS**
- ⚡ **Vite**
- 🌍 **OMDb API**
- 💾 **LRU Cache**

## 🐛 Решение проблем

Если появилась ошибка "Missing Root Route file":

1. Убедитесь, что вы находитесь в корневой папке проекта
2. Проверьте, что все файлы загружены: `git pull origin main`
3. Переустановите зависимости: `rm -rf node_modules package-lock.json && npm install`

---

**Создано с ❤️ используя Remix + TypeScript + OMDb API**