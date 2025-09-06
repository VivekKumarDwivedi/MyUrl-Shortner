# UrlShortner Service

A simple and efficient URL shortener service built with Express, TypeScript, MongoDB, Redis, and tRPC.

#### 🚀 Features

- **URL Shortening**: Convert long URLs to short, manageable links
- **Click Tracking**: Monitor how many times each short URL has been accessed
- **High Performance**: Redis caching for improved response times
- **Multiple API Interfaces**:
  - REST API (v1 and v2)
  - tRPC for type-safe API calls
- **Base62 Encoding**: Efficient short URL generation using base62 encoding
- **Comprehensive Logging**: Winston logger with daily rotation
- **Error Handling**: Centralized error handling with correlation IDs
- **Database Indexing**: Optimized MongoDB queries with proper indexing
- **Type Safety**: Full TypeScript implementation with Zod validation


## Project Structure

```
.
├── src/
│   ├── config/           # App, DB, Redis, logger configs
│   ├── controllers/      # Express/trpc controllers
│   ├── dtos/             # Data transfer objects
│   ├── middlewares/      # Express middlewares
│   ├── models/           # Mongoose models
│   ├── repositories/     # Data access logic (MongoDB, Redis)
│   ├── routers/          # API and tRPC routers
│   ├── services/         # Business logic
│   ├── utils/            # Helpers, error classes, base62
│   └── validators/       # Zod schemas and validation
├── logs/                 # Rotating log files
├── .env                  # Environment variables
├── package.json
├── tsconfig.json
└── README.md
```

## Getting Started

### 1. Clone the repository

```sh
git clone https://github.com/VivekKumarDwivedi/MyUrl-Shortner.git <ProjectName>
cd <ProjectName>
```

### 2. Install dependencies

```sh
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory:

```env
PORT=7777
MONGO_URI="mongodb://localhost:27017/short_my_url"
REDIS_URL="redis://localhost:6379"
REDIS_COUNTER_KEY="short_url_counter"
BASE_URL="http://localhost:7777"
```

Adjust values as needed for your environment.

### 4. Start the Application

**Development mode:**

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

The server will start on the port specified in `.env` (default: 7777).

## API Endpoints

### REST Endpoints

- `GET /:shortUrl`  
  Redirects to the original URL.

- `GET /api/v1/ping`  
  Health check endpoint.

### tRPC Endpoints

- `POST /trpc/url.create`  
  Shorten a URL.

- `GET /trpc/url.getOriginalUrl`  
  Retrieve the original URL from a short URL.

## Technologies Used

- [Express](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [MongoDB + Mongoose](https://mongoosejs.com/)
- [Redis](https://redis.io/)
- [tRPC](https://trpc.io/)
- [Zod](https://zod.dev/) (validation)
- [Winston](https://github.com/winstonjs/winston) (logging)
- [Nodemon](https://nodemon.io/) (development tool)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by the need for a simple, efficient URL shortening service.
- Built as a personal project to explore and showcase skills in modern web development technologies.
