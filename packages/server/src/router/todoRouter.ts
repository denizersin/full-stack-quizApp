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

export const protected2 = trpc.procedure.use(isAuth)


