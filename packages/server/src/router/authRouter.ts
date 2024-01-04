import { createTrpcRouter, isAuth, trpc } from '../lib/trpc'
import { z } from 'zod'
import { createUserReqSchema } from '../model/validators/user/user'
import { TRPCError } from '@trpc/server'
import { v4 as uuidv4 } from 'uuid';
import { generateTokens } from '@/lib/utils/jwt'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import cookie from 'cookie'
import { updateQuizSetReqSchema } from '@/model/validators/quizset';

const protected2 = trpc.procedure.use(isAuth)

export const authRouter = createTrpcRouter({

    register: trpc.procedure
        .input(createUserReqSchema)
        .mutation(async ({ ctx, input }) => {

            const {
                Models: { UserModel, AuthModel },
            } = ctx

            const { email, password, name, surname, birthDate, identityNo } = input

            const existingUser = await UserModel.findUserByEmail(email);
            const existingIdetity = await UserModel.findUserByIdentityNo(identityNo);
            if (existingUser) {
                throw new Error('Email already in use.');
            }
            if (existingIdetity) {
                throw new Error('Identity already in use.');
            }

            const isTrue = await new Promise((resolve, reject) => {
                ctx.SOAP_CLIENT.TCKimlikNoDogrula({
                    TCKimlikNo: identityNo,
                    Ad: name,
                    Soyad: surname,
                    DogumYili: birthDate
                }, (err: any, result: any) => {
                    if (result.TCKimlikNoDogrulaResult) {
                        console.log("Doğru")
                        resolve(true)
                    } else {
                        console.log("Yanliş")
                        resolve(false)
                    }
                });
            })

            if (!isTrue) {
                throw new TRPCError({
                    code: "PARSE_ERROR",
                    message: 'Wrong  identity ',
                })
            }


            const user = await UserModel.createUserByEmailAndPassword({ email, password, name, surname, birthDate, identityNo });
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
                    code: "NOT_IMPLEMENTED",
                    message: 'Email not found',
                })
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                throw new TRPCError({
                    code:"NOT_FOUND",
                    message: 'Wrong Password',
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

            // console.log('GET SESSION');

            const cookies = cookie.parse(ctx.req.headers.cookie ?? '')
            const authToken = cookies['refresh-token']
            // console.log(authToken,);

            if (!authToken) return null

            //@ts-ignore
            const payload = jwt.verify(authToken, process.env.JWT_REFRESH_SECRET);

            const savedRefreshToken = await AuthModel.findRefreshTokenById(payload.jti!);

            const user = await UserModel.findUserById(payload.userId);

            if (user) {
                user.identityNo = user.identityNo.slice(0, 3) + "*****" + user.identityNo.slice(8, 11)
                return user
            }

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
