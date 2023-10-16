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
