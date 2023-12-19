import { TCreateUserReq, createUserReqSchema } from './../../validators/user/user';
import { Prisma, User } from "@prisma/client"
import { prisma } from "../../../lib/prismaClient"

type User2 = Prisma.UserGetPayload<{
    include: {
        refreshTokens?: true
    }
}>

export type TUser = User2 & {

}


class UserModel {

    createUser = (user: TCreateUserReq): Promise<TUser> => {

        return prisma.user.create({
            data: {
                ...user
            }
        })

    }
}
