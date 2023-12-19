import { inferAsyncReturnType, initTRPC, TRPCError } from '@trpc/server'
import * as trpcExpress from '@trpc/server/adapters/express'
import { UserModel } from '../model/UserModel';
import { AuthModel } from '../model/AuthModel';
import { setCookie } from './utils/session';
import cookie, { CookieSerializeOptions } from 'cookie'


const Models: {
  UserModel: UserModel,
  AuthModel: AuthModel
} = {
  UserModel: new UserModel(),
  AuthModel: new AuthModel()
}


export const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => {



  return {
    Models: Models,
    req,
    res
  }
}



type Context = inferAsyncReturnType<typeof createContext>

const trpc = initTRPC.context<typeof createContext>().create()

export const createTrpcRouter = trpc.router;



const middleware = trpc.middleware

export const isAuth = middleware(async ({
  ctx, next,...props
}) => {
  const { req, res } = ctx
  const cookies = cookie.parse(req.headers.cookie ?? '')

  console.log(cookies['refresh-token'])

  const authToken = cookies['refresh-token']

  if (!authToken) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You are not authorized',
    })
  }
  return next({
    ctx: {
      ...ctx,...props
    },
  });
})
export const protectedProcedure = trpc.procedure.use(isAuth)
export const publicProcedure = trpc.procedure
export {trpc}