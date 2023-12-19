import { TRPCError } from '@trpc/server'
import { createTrpcRouter, trpc } from '../lib/trpc'
import { todoRouter } from './todoRouter'
import cookie, { CookieSerializeOptions } from 'cookie'
import { authRouter } from './authRouter'


export const appRouter = createTrpcRouter({
  todo: todoRouter,
  auth:authRouter
})



export type AppRouter = typeof appRouter
