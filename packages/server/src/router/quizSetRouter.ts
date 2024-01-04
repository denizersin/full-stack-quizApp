import { createQuizSetReqSchema, updateQuizSetReqSchema } from '@/model/validators/quizset'
import { z } from 'zod'
import { Models, createTrpcRouter } from '../lib/trpc'
import { protected2 } from './todoRouter'
import { Prisma, QuizSet } from '@prisma/client'

type TgetQuizSetById = Prisma.QuizSetGetPayload<
    {
        include: {
            quizzes: {
                include: {
                    fillInTheBlankQuiz: true,
                    multipleChoiceQuiz: true
                },
            }
        }
    }>

const quizSetPagingReqSchema = z.object({
    limit: z.number(),
    userId: z.string().optional(),
    sortField: z.string().optional(),
    sortOrder: z.string().optional(),
    globalSearch: z.string().optional(),
    cursor: z.number().nullish(), // <-- "cursor" needs to exist, but can be any type
})

export type TQuizSetPagingReq = z.infer<typeof quizSetPagingReqSchema>

export const quizSetRouter = createTrpcRouter({

    createQuizSet: protected2.input(z.object({}))
        .mutation(async ({ ctx, ...rest }) => {
            const { QuizSetModel } = ctx.Models
            const data = rest.input
            const newSet = await QuizSetModel.createQuizSet(ctx.user)
            // console.log(newSet, "new sste");
            return newSet as QuizSet
        }),

    getQuizSet: protected2.query(async ({ ctx, ...rest }) => {
        const { QuizSetModel } = ctx.Models
        const data = await Models.QuizSetModel.getAllQuizSets(ctx.user)
        return data as QuizSet[]
    }),
    quizSetPaging: protected2
        .input(quizSetPagingReqSchema)
        .query(async ({ ctx, ...rest }) => {
            const { QuizSetModel } = ctx.Models
            const data = await QuizSetModel.quizSetPaging(rest.input, ctx.user)
            return data as {
                quizSets: QuizSet[],
                next: QuizSet | null
            }
        }),
    getQuizSetById: protected2.input(z.number()).query(async ({ ctx, ...rest }) => {
        const { QuizSetModel } = ctx.Models
        const quizSet = await QuizSetModel.getQuizSetById(rest.input, ctx.user)
        return quizSet as TgetQuizSetById
    }),
    deleteQuizSetById: protected2.input(z.object({ id: z.number() })).mutation(async ({ ctx, ...rest }) => {
        const { QuizSetModel } = ctx.Models
        QuizSetModel.deleteQuizSetById(rest.input.id, ctx.user);
        return true
    }),
    updateQuizSetById: protected2.input(updateQuizSetReqSchema).mutation(async ({ ctx, ...rest }) => {
        const { QuizSetModel } = ctx.Models
        const updatedQuizSet = await QuizSetModel.updateQuizSetById(rest.input.id, rest.input, ctx.user)
        return updatedQuizSet as QuizSet
    }),
    addQuiz: protected2.input(z.object({ quizId: z.number(), quizSetId: z.number() }))
        .mutation(async ({ ctx, ...rest }) => {
            const { QuizSetModel } = ctx.Models
            const r = await QuizSetModel.addQuizToQuizSet(rest.input)
            return r
        }),

    removeQuiz: protected2.input(z.object({ quizId: z.number(), quizSetId: z.number() }))
        .mutation(async ({ ctx, ...rest }) => {
            const { QuizSetModel } = ctx.Models
            const r = await QuizSetModel.removeQuizFromQuizSet(rest.input)
            return r
        }),


})
