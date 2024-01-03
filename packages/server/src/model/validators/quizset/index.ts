
import z from "zod"

export const createQuizSetReqSchema = z.object({
    title: z.string().min(3),
    description: z.string().optional(),
})

export const updateQuizSetReqSchema = createQuizSetReqSchema.extend({
    id: z.number()
})


export type TCreateQuizSetReq = z.infer<typeof createQuizSetReqSchema>


