to run `pnpm run dev`

| Name         | Description                                                                              | Docs Link                                                  |
| ------------ | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| Next.js 13   | The latest version of the popular React framework for building web applications.         | https://nextjs.org/docs/getting-started                    |
| Vercel       | A cloud platform for static sites and serverless functions.                              | https://vercel.com/docs                                    |
| trpc         | A TypeScript-first RPC framework for building scalable APIs.                             | https://trpc.io/docs/                                      |
| zod          | A TypeScript-first schema validation library.                                            | https://github.com/vriad/zod                               |
| react-form   | A lightweight and extensible library for building forms in React.                        | https://react-hook-form.com/get-started                    |
| Radix UI     | A collection of accessible and reusable components for building modern interfaces.       | https://www.radix-ui.com/docs/getting-started/introduction |
| Shadcn       | A collection of beautiful and customizable CSS shadows.                                  | https://shadcn.com/                                        |
| CVA          | A library for building complex animations and interactions in React.                     | https://cvarose.com/docs/                                  |
| Lucide React | A library of beautiful and customizable SVG icons for React.                             | https://lucide.dev/docs/                                   |
| Tailwind CSS | A utility-first CSS framework for rapidly building custom designs.                       | https://tailwindcss.com/docs                               |
| Drizzle      | A collection of front-end libraries for building decentralized applications on Ethereum. | https://www.trufflesuite.com/docs/drizzle                  |
| PlanetScale  | A cloud-native database platform for scaling MySQL.                                      | https://docs.planetscale.com/                              |
| Clerk        | A secure and easy-to-use authentication and user management platform.                    | https://docs.clerk.dev/                                    |

### Steps

1. install drizzle orm

```shell
pnpm add drizzle-orm @planetscale/database
pnpm add -D drizzle-kit
pnpm add -D mysql2
```

2. create a planetscale account and create a dev branch

3. add envariables for planetscale

```
DATABASE_HOST=
DATABASE_USERNAME=
DATABASE_PASSWORD=
```

4. add config file for drizzle

```typescript
import dotenv from 'dotenv'
import type { Config } from 'drizzle-kit'
dotenv.config()

export default {
  schema: './schema/drizzle.ts', // change to correct drizzle schema path
  out: './drizzle',
  driver: 'mysql2',
  dbCredentials: {
    connectionString: `mysql://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}/waypok-poc-v2?ssl={"rejectUnauthorized":true}`,
  },
} satisfies Config
```

5. create a db client with drizzle and planetscale

```typescript
import * as schema from '@/schema/drizzle'
import { connect } from '@planetscale/database'
import { drizzle } from 'drizzle-orm/planetscale-serverless'

const connection = connect({
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
})

export const db = drizzle(connection, { schema }) // don't forget to add schema
```
