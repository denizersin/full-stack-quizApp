
import { hashToken } from '@/lib/utils/hashToken'

import { prisma } from '@/lib/prismaClient';
import { Prisma } from '@prisma/client';



// used when we create a refresh token.
export class AuthModel {

    addRefreshTokenToWhitelist({ jti, refreshToken, userId }: { jti: string, refreshToken: string, userId: string }) {
        return prisma.refreshToken.create({
            data: {
                id: jti,
                hashedToken: hashToken(refreshToken),
                userId
            },
        });
    }

    // used to check if the token sent by the client is in the database.
    findRefreshTokenById(id: string) {
        return prisma.refreshToken.findUnique({
            where: {
                id,
            },
        });
    }

    // soft delete tokens after usage.
    deleteRefreshToken(id: string) {
        return prisma.refreshToken.update({
            where: {
                id,
            },
            data: {
                revoked: true
            }
        });
    }

    revokeTokens(userId: string) {
        return prisma.refreshToken.updateMany({
            where: {
                userId
            },
            data: {
                revoked: true
            }
        });
    }
}
