import { TRPCError } from '@trpc/server'
import { createTrpcRouter, trpc } from '../lib/trpc'
import cookie, { CookieSerializeOptions } from 'cookie'
import { authRouter } from './authRouter'
import { quizSetRouter } from './quizSetRouter'
import { quizRouter } from './quiz'


export const appRouter = createTrpcRouter({
  auth: authRouter,
  quizSet: quizSetRouter,
  quiz: quizRouter
})



export type AppRouter = typeof appRouter
