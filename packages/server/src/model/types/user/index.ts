import { Prisma, User } from "@prisma/client"


type User2 = Prisma.UserGetPayload<{
    include: {
        refreshTokens?: true
    }
}>

export type TUser = User2 & {

}


