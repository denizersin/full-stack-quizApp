import z from "zod"

export const createUserReqSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().min(3),
})

export type TCreateUserReq = z.infer<typeof createUserReqSchema>

export const createUserResSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
}) 

export type TCreateUserRes = z.infer<typeof createUserResSchema>





