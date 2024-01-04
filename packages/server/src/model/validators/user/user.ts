import z from "zod"

export const createUserReqSchema = z.object({
    email: z.string().email(),
    password: z.string().min(10, {
        message: "Password must be at least 10 characters.",
    }),
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    surname: z.string().min(2, {
        message: "Surname must be at least 2 characters.",
    }),
    birthDate: z.string(),
    identityNo: z.string().min(11, {
        message: "Identity Number must be at least 11 characters.",
    },).max(11, { message: "Identity Number must be at most 11 characters." }),
})

export type TCreateUserReq = z.infer<typeof createUserReqSchema>

export const createUserResSchema = z.object({
    email: z.string().email(),
    password: z.string().min(10, {
        message: "Password must be at least 10 characters.",
    }),
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    surname: z.string().min(2, {
        message: "Surname must be at least 2 characters.",
    }),
    birthDate: z.string(),
    identityNo: z.string().min(11, {
        message: "Identity Number must be at least 11 characters.",
    },).max(11, { message: "Identity Number must be at most 11 characters." }),
})

export type TCreateUserRes = z.infer<typeof createUserResSchema>



export const updateUserReqSchema = z.object({
    email: z.string().email(),
    password: z.string().min(10, {
        message: "Password must be at least 10 characters.",
    }),
    name: z.string().optional(),
    surname: z.string().optional(),
    birthDate: z.string().optional(),
    identityNo: z.string().optional(),
})


export type TUpdateUserReq = z.infer<typeof updateUserReqSchema>

