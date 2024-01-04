import { prisma } from '@/lib/prismaClient';
import { TCreateQuizSetReq } from './validators/quizset/index';
import { TUser } from './types';
import { z } from 'zod';
import { TQuizSetPagingReq } from '@/router/quizSetRouter';



export class QuizSetModel {


    createQuizSet = async (user: TUser) => {
        const count = await prisma.quizSet.count()
        return await prisma.quizSet.create({
            data: {
                title: "New Quiz Set" + count,
                userId: user.id
            }
        })
    }
    getAllQuizSets = async (user: TUser) => {
        const quizSets = await prisma.quizSet.findMany({
            where: {
                userId: user.id
            }
        })
        return quizSets
    }
    quizSetPaging = async (data: TQuizSetPagingReq, user: TUser) => {


        const quizSets = await prisma.quizSet.findMany({
            where: {
                userId: user.id,
            },

            take: data.limit + 1,
            cursor: data.cursor ? {
                id: data.cursor
            } : undefined
        })


        let next = quizSets.length > data.limit ? quizSets.pop() : null
        return {
            quizSets,
            next
        }
    }
    getQuizSetById = async (id: number, user: TUser) => {
        return await prisma.quizSet.findUnique({
            where: {
                id: id
            },
            include: {
                quizzes: {
                    include: {
                        fillInTheBlankQuiz: true,
                        multipleChoiceQuiz: true,
                    },

                }
            }
        })
    }

    deleteQuizSetById = async (id: number, user: TUser) => {
        return await prisma.quizSet.delete({
            where: {
                id: id
            }
        })
    }

    //update

    updateQuizSetById = async (id: number, data: TCreateQuizSetReq, user: TUser) => {
        return await prisma.quizSet.update({
            where: {
                id: id
            },
            data: {
                // ...data
            }
        })
    }

    addQuizToQuizSet = async (data: {
        quizId: number,
        quizSetId: number
    }) => {

        try {
            await prisma.quizSet.update({
                where: {
                    id: data.quizSetId
                },
                data: {
                    quizzes: {
                        connect: {
                            id: data.quizId
                        }
                    }
                }
            })
            return true
        }
        catch {
            return false
        }

    }

    removeQuizFromQuizSet = async (data: {
        quizId: number,
        quizSetId: number
    }) => {
        try {
            await prisma.quizSet.update({
                where: {
                    id: data.quizSetId
                },
                data: {
                    quizzes: {
                        disconnect: {
                            id: data.quizId
                        },
                    }
                }
            })
            return true
        }
        catch {
            return false
        }
    }



}



