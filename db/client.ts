import * as schema from '@/schema/drizzle'
import { connect } from '@planetscale/database'
import { drizzle } from 'drizzle-orm/planetscale-serverless'

const connection = connect({
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
})

/* const connection = mysql.createConnection({
  uri: `mysql://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}/waypok-poc-v2?ssl={"rejectUnauthorized":true}`,
}) */

export const db = drizzle(connection, { schema })
