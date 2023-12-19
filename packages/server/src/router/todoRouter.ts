import { prisma } from '../lib/prismaClient'
import { createTrpcRouter, isAuth, trpc } from '../lib/trpc'
import { z } from 'zod'
import { createUserReqSchema } from '../model/validators/user/user'
import { TRPCError } from '@trpc/server'
import { v4 as uuidv4 } from 'uuid';
import { generateTokens } from '@/lib/utils/jwt'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import cookie, { CookieSerializeOptions } from 'cookie'
import { protectedProcedure, publicProcedure } from '@/lib/trpc'

const protected2 = trpc.procedure.use(isAuth)
export const todoRouter = createTrpcRouter({
  sayHello: protected2.input(z.object({ input: z.string() }))
    .mutation(async ({ ctx, ...rest }) => {

      const { input } = rest

      return `H123123ello ${input.input}! from wqeqwe SERVER`
    }),
  user: trpc.procedure
    .input(createUserReqSchema)
    .mutation(async ({ ctx, input }) => {

      const {
        Models: { UserModel, AuthModel },
      } = ctx
      const { email, password, name } = input
      const existingUser = await UserModel.findUserByEmail(email);

      if (existingUser) {
        // throw new Error('Email already in use.');
      }

      const user = await UserModel.createUserByEmailAndPassword({ email, password, name });
      const jti = uuidv4();
      const { accessToken, refreshToken } = generateTokens(user, jti);
      await AuthModel.addRefreshTokenToWhitelist({ jti, refreshToken, userId: user.id });

      ctx.res.cookie('refresh-token', refreshToken, {
        httpOnly: true, secure: true, sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 8 // 8 hours
      })




      return user

    })
  ,
  list: protected2.query(({ ctx }) => {
    // const todos = await prisma.todo.findMany()
    // return todos
    return prisma.todo.findMany()
  }),
  create: protected2
    .input(z.object({ title: z.string() }))
    .mutation(({ input }) => {
      const title = input.title
      return prisma.todo.create({
        data: {
          title: title,
          isCompleted: false,
        },
      })
    }),
  delete: protected2
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => {
      return prisma.todo.delete({
        where: {
          id: input.id,
        },
      })
    }),
  update: protected2
    .input(z.object({ id: z.string(), isCompleted: z.boolean() }))
    .mutation(({ ctx, input }) => {
      return prisma.todo.update({
        where: {
          id: input.id,
        },
        data: {
          isCompleted: input.isCompleted,
        },
      })
    }),

  login: trpc.procedure
    .input(z.object({ email: z.string(), password: z.string() }))
    .mutation(async ({ ctx, input }) => {

      const {
        Models: { UserModel, AuthModel },
      } = ctx
      const { email, password } = input
      const user = await UserModel.findUserByEmail(email);

      if (!user) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You are not authorized',
        })
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You are not authorized',
        })
      }

      const jti = uuidv4();
      const { accessToken, refreshToken } = generateTokens(user, jti);
      await AuthModel.addRefreshTokenToWhitelist({ jti, refreshToken, userId: user.id });

      ctx.res.cookie('refresh-token', refreshToken, {
        httpOnly: true, secure: true, sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 8 // 8 hours
      })
    }),

  getSession: trpc.procedure
    .query(async ({ ctx, input }) => {
      const {
        Models: { UserModel, AuthModel },
      } = ctx

      console.log('GET SESSION');

      const cookies = cookie.parse(ctx.req.headers.cookie ?? '')
      const authToken = cookies['refresh-token']
      console.log(authToken,);

      if (!authToken) return null

      //@ts-ignore
      const payload = jwt.verify(authToken, process.env.JWT_REFRESH_SECRET);

      const savedRefreshToken = await AuthModel.findRefreshTokenById(payload.jti!);
      
      const user = await UserModel.findUserById(payload.userId);

      if (user) return user

      return null


    }),

  logOut: trpc.procedure.input(z.object({})).mutation(async ({ ctx, input }) => {
    const {
      Models: { UserModel, AuthModel },
    } = ctx

    const cookies = cookie.parse(ctx.req.headers.cookie ?? '')
    const authToken = cookies['refresh-token']

    if (!authToken) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'You are not authorized',
      })
    }
    //@ts-ignore
    const payload = jwt.verify(authToken, process.env.JWT_REFRESH_SECRET);
    const savedRefreshToken = await AuthModel.findRefreshTokenById(payload.jti!);
    const user = await UserModel.findUserById(payload.userId);

    if (!user) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'You are not authorized',
      })
    }

    await AuthModel.deleteRefreshToken(savedRefreshToken!.id);

    ctx.res.clearCookie('refresh-token', {
      httpOnly: true, secure: true, sameSite: 'none',
    })

    return true
  }
  )


})
