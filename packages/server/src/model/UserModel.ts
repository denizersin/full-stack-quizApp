import { prisma } from "../lib/prismaClient"
import { TUser } from "./types/user"
import { TCreateUserReq } from "./validators/user/user"
import bcrypt from "bcrypt"
export class UserModel {

    createUser = (user: TCreateUserReq): Promise<TUser> => {

        return prisma.user.create({
            data: {
                ...user
            }
        })

    }



    findUserByEmail(email: string) {
        return prisma.user.findUnique({
            where: {
                email,
            },
        });
    }
    findUserByIdentityNo(identityNo: string) {
        return prisma.user.findUnique({
            where: {
                identityNo
            },
        });
    }

    createUserByEmailAndPassword(user: TCreateUserReq): Promise<TUser> {
        user.password = bcrypt.hashSync(user.password, 12);
        return prisma.user.create({
            data: {
                ...user,
            },
        });
    }

    findUserById(id: string) {
        return prisma.user.findUnique({
            where: {
                id,
            },
        });
    }
    updateUserById(data: {
        email?: string,
        password?: string,
        id: string
    }) {
        if (data.password)
            data.password = bcrypt.hashSync(data.password, 12);

        return prisma.user.update({
            where: {
                id: data.id
            },
            data,
        });
    }
}
