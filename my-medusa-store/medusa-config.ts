import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

// Storefront origin must be allowed for store API (e.g. car-bookings). Comma-separated list.
const defaultStoreCors = [
  'http://localhost:3000',
  'http://localhost:6001',
  'http://localhost:8000',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:6001',
  'http://127.0.0.1:8000',
].join(',')

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS ?? defaultStoreCors,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  },
  modules: [
    {
      resolve: "./src/modules/car",
    },
    {
      resolve: "./src/modules/cars",
    },
  ],
})
