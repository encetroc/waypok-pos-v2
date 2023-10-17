### to run

1. install pnpm
2. `pnpm install`
3. `pnpm run dev`

### using

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

0. change tcconfig from es5 to es2015
1. (db setup) install drizzle orm

```shell
pnpm add drizzle-orm @planetscale/database
pnpm add -D drizzle-kit
pnpm add -D mysql2
```

2. (db setup) create a planetscale account and create a dev branch

3. add env vars for planetscale

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

6. (auth setup) install clerk

```shell
pnpm add @clerk/nextjs
```

7. add env vars for clerk

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

8. wrap your whole app in `<ClerkProvider>`
9. add middleware file, this will protect all routes

```typescript
import { authMiddleware } from '@clerk/nextjs'

export default authMiddleware({
  publicRoutes: ['/'],
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
```

10. add signup page in `app/sign-up/[[...sign-up]]/page.tsx`

```typescript
import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return <SignUp />
}
```

11. add signin page in `app/sign-in/[[...sign-in]]/page.tsx`

```typescript
import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return <SignIn />
}
```

12. for clerk dark theme install `pnpm add @clerk/themes` then:

```typescript
import { dark } from '@clerk/themes'
// ...
<ClerkProvider appearance={{ baseTheme: dark}}>
```

13. (shadcn & theme) follow [shadcn nextjs guide](https://ui.shadcn.com/docs/installation/next)
14. setup dark theme [shadcn nextjs theming](https://ui.shadcn.com/docs/dark-mode/next)
15. install icons `pnpm install lucide-react`
16. (trpc) install packages `pnpm add @trpc/client @trpc/react-query @trpc/server @tanstack/react-query superjson`
17. create aa dynamic api route

```typescript
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'

import { appRouter } from '@/server'
import { createTRPCContext } from '@/server/trpc'

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: createTRPCContext,
  })

export { handler as GET, handler as POST }
```

18. add the following files to server folder

```typescript
// client.ts
import { createTRPCReact } from '@trpc/react-query'

import { type AppRouter } from '@/server'

export const trpc = createTRPCReact<AppRouter>({})
```

```typescript
// index.ts
import { protectedProcedure, publicProcedure, router } from '@/server/trpc'
import { inferRouterOutputs } from '@trpc/server'

export const appRouter = router({
  public: publicProcedure.query(() => 'this is a public route'),
  protected: protectedProcedure.query(() => 'this is a protected route'),
})

type RouterOutput = inferRouterOutputs<AppRouter>

export type AppRouter = typeof appRouter
```

```typescript
// trpc.ts
import {
  SignedInAuthObject,
  SignedOutAuthObject,
  auth,
} from '@clerk/nextjs/server'
import { TRPCError, initTRPC } from '@trpc/server'
import superjson from 'superjson'

export type AuthContext = {
  auth: SignedInAuthObject | SignedOutAuthObject
}

const createInnerTRPCContext = ({ auth }: AuthContext) => {
  return {
    auth,
  }
}

export const createTRPCContext = () => {
  return createInnerTRPCContext({ auth: auth() })
}

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape
  },
})

const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.auth.userId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }

  return next({
    ctx: {
      auth: ctx.auth,
    },
  })
})

export const router = t.router
export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(isAuthed)
```

19. create context for trpc and wrap your app in it

```typescript
'use client'

import { trpc } from '@/server/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
import React, { useState } from 'react'
import superjson from 'superjson'

export default function TrpcProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [queryClient] = useState(() => new QueryClient({}))
  const [trpcClient] = useState(() =>
    trpc.createClient({
      transformer: superjson,
      links: [
        httpBatchLink({
          url: '/api/trpc',
        }),
      ],
    })
  )
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  )
}
```

### Example

1. create a db schema in `schema/drizzle.ts`

```typescript
export const pokemon = mysqlTable('pokemon', {
  id: int('id').primaryKey().autoincrement(),
  name: text('name'),
})
```

2. can use [drizzle query](https://orm.drizzle.team/docs/rqb) directly in a server component, which is the default component in nextjs

```typescript
export default async function page() {
  const pokemons = await db.query.pokemon.findMany()
  return (
    <ul>
      {pokemons.map((pokemon) => (
        <li key={pokemon.id}>{pokemon.name}</li>
      ))}
    </ul>
  )
}
```

3. for mutations, create a trpc route in `server/index.ts`

```typescript
  createPokemon: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({input}) => {
      const pokemon = db.insert(pokemonDrizzleSchema).values(input)
      return pokemon
    }),
```

4. create a form with text input and use `createPokemon` procedure
5. create a `CreatePokemon` component that uses the `createPokemon` procedure to create a pokemon
