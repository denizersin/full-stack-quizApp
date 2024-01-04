import { inferAsyncReturnType, initTRPC, TRPCError } from '@trpc/server'
import * as trpcExpress from '@trpc/server/adapters/express'
import { UserModel } from '../model/UserModel';
import { AuthModel } from '../model/AuthModel';
import { setCookie } from './utils/session';
import cookie, { CookieSerializeOptions } from 'cookie'
import { QuizSetModel } from '@/model/QuizSetModel';
import jwt from 'jsonwebtoken'
import { TUser } from '..';
import { QuizModel } from '@/model/QuizModel';

import { SOAP_ADRES } from '@/lib/constants';
const soap = require('soap');



export const Models: {
  UserModel: UserModel,
  AuthModel: AuthModel,
  QuizSetModel: QuizSetModel,
  QuizModel: QuizModel
} = {
  UserModel: new UserModel(),
  AuthModel: new AuthModel(),
  QuizSetModel: new QuizSetModel(),
  QuizModel: new QuizModel()
}

let SOAP_CLIENT: any = null;

soap.createClient(SOAP_ADRES, (err: any, client: any) => {
  SOAP_CLIENT = client;
});

export const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => {



  return {
    Models: Models,
    SOAP_CLIENT,
    req,
    res
  }
}



type Context = inferAsyncReturnType<typeof createContext>

const trpc = initTRPC.context<typeof createContext>().create()

export const createTrpcRouter = trpc.router;



const middleware = trpc.middleware

export const isAuth = middleware(async ({
  ctx, next, ...props
}) => {
  const { req, res } = ctx
  const cookies = cookie.parse(req.headers.cookie ?? '')

  // console.log(cookies['refresh-token'])

  const authToken = cookies['refresh-token']

  if (!authToken) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You are not authorized',
    })
  }

  //@ts-ignore
  const payload = jwt.verify(authToken, process.env.JWT_REFRESH_SECRET);

  const savedRefreshToken = await Models.AuthModel.findRefreshTokenById(payload.jti!);

  const user = await Models.UserModel.findUserById(payload.userId);

  if (!user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You are not authorized',
    })
  }

  return next({
    ctx: {
      ...ctx, ...props,
      user
    },
  });
})
export const protectedProcedure = trpc.procedure.use(isAuth)
export const publicProcedure = trpc.procedure
export { trpc }