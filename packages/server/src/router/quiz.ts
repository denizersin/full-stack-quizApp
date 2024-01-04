import { createQuizSetReqSchema, updateQuizSetReqSchema } from '@/model/validators/quizset'
import { z } from 'zod'
import { Models, createTrpcRouter } from '../lib/trpc'
import { protected2 } from './todoRouter'
import { Prisma, QuizSet } from '@prisma/client'
import { prisma } from '@/lib/prismaClient'
import { updateUserReqSchema } from '@/model/validators/user/user'
import { TUser } from '..'



type T2 = Prisma.QuizGetPayload<{
    include: {

    },
    multipleChoiceQuiz: true

}>[]

type TGetQuizByIdRes = Prisma.QuizGetPayload<{
    include: {
        multipleChoiceQuiz: {
            include: {
                MultipleChoiceQuestions: {
                    include: {
                        optionsList: true
                    }
                }
            }
        }

    }
}>


const quizesPagingReqSchema = z.object({
    limit: z.number(),
    userId: z.string().optional(),
    sortField: z.string().optional(),
    sortOrder: z.string().optional(),
    globalSearch: z.string().optional(),
    cursor: z.number().nullish(), // <-- "cursor" needs to exist, but can be any type,
    notQuizSetId: z.number().optional(),
    title: z.string().optional(),
    type: z.string().optional(),
})

export type TQuizesPagingReq = z.infer<typeof quizesPagingReqSchema>


export const quizRouter = createTrpcRouter({



    getQuizes: protected2.query(async ({ ctx, ...rest }) => {
        const { QuizSetModel } = ctx.Models
        const data = await Models.QuizModel.getAllQuizes(ctx.user as TUser)
        return data as T2;
    }),

    getRecentQuiz: protected2.query(async ({ ctx, ...rest }) => {
        const data = await Models.QuizModel.getRecentQuizes(ctx.user as TUser)
        return data as T2;
    }),

    getMostUnsuccessfulQuiz: protected2.query(async ({ ctx, ...rest }) => {
        const data = await Models.QuizModel.getMostUnsuccessfulQuizes(ctx.user as TUser)
        return data as T2;
    }),

    paging: protected2
        .input(quizesPagingReqSchema)
        .query(async ({ ctx, ...rest }) => {
            const { QuizModel } = ctx.Models
            const data = await QuizModel.quizesPaging(rest.input, ctx.user)
            return data as {
                quizes: T2,
                next: T2[0] | null
            }
        }),

    getQuiz: protected2
        .input(z.number())
        .query(async ({ ctx, ...rest }) => {
            const { QuizModel } = ctx.Models
            const data = await QuizModel.getQuizById(rest.input)
            return data as TGetQuizByIdRes;
        }),

    endQuiz: protected2.input(z.object({
        trueNumber: z.number(),
        falseNumber: z.number(),
        emptyNumber: z.number(),
        quizId: z.number()
    }))
        .mutation(async ({ ctx, ...rest }) => {
            const { QuizModel } = ctx.Models
            const result = await QuizModel.endQuiz(rest.input)
        }),

    generateNewQuiz: protected2.input(z.object({
        title: z.string(),
        notes: z.string().optional(),
        questionCount: z.number()

    }))
        .mutation(async ({ ctx, ...rest }) => {
            const { QuizModel } = ctx.Models
            const result = await QuizModel.generateQuiz({
                ...rest.input,
                userId: ctx.user.id
            })
            console.log('Result: ', result);

            return result as TGetQuizByIdRes
        }),

    generateNewQuestion: protected2
        .input(z.object({
            questId: z.number()
        }))
        .mutation(async ({ ctx, ...rest }) => {
            const { QuizModel } = ctx.Models
            const result = await QuizModel.reGenerateQuestion(rest.input.questId)
            return result
        }),

    deleteQuiz: protected2.input(z.object({ id: z.number() })).mutation(async ({ ctx, ...rest }) => {
        const { QuizModel } = ctx.Models
        await QuizModel.deleteQuizById(rest.input.id);
        console.log(rest.input.id);
        return true
    }),

    updateUser: protected2.input(updateUserReqSchema).mutation(async ({ ctx, input }) => {
        const {
            Models: { UserModel, AuthModel },
        } = ctx
        const { email, password } = input
        // const existingUser = await UserModel.findUserByEmail(email);

        const updatedUser = await UserModel.updateUserById({ id: ctx.user.id, email, password });
        return updatedUser
    }
    ),
})
