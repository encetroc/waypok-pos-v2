import dotenv from 'dotenv'
import type { Config } from 'drizzle-kit'
dotenv.config()

export default {
  schema: './schema/drizzle.ts',
  out: './drizzle',
  driver: 'mysql2',
  dbCredentials: {
    connectionString: `mysql://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}/waypok-poc-v2?ssl={"rejectUnauthorized":true}`,
  },
} satisfies Config
