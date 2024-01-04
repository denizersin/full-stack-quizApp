import { prisma } from '@/lib/prismaClient';
import { TCreateQuizSetReq } from './validators/quizset/index';
import { TUser } from './types';
import { z } from 'zod';
import { TQuizesPagingReq } from '@/router/quiz';
import { quizesData } from '@/lib/createMockData';
import { QuestionType } from '@prisma/client';




export class QuizModel {
    getAllQuizes = async (user: TUser) => {

        const quizes = await prisma.quiz.findMany({
            
            where: {
                userId: user.id
            }
            , include: {
                fillInTheBlankQuiz: {
                    select: {
                        _count: {
                            select: {
                                fillInTheBlankQuestions: true
                            }
                        }
                    }
                },
                multipleChoiceQuiz: {
                    select: {
                        _count: {
                            select: {
                                MultipleChoiceQuestions: true
                            }
                        }
                    }
                },
            },

        })
        return quizes
    }

    getRecentQuizes = async (user: TUser) => {
        const quizes = await prisma.quiz.findMany({
            
            where: {
                userId: user.id,
                takenCount:{
                    gte:1
                }
            }
            , include: {
                fillInTheBlankQuiz: {
                    select: {
                        _count: {
                            select: {
                                fillInTheBlankQuestions: true
                            }
                        }
                    }
                },
                multipleChoiceQuiz: {
                    select: {
                        _count: {
                            select: {
                                MultipleChoiceQuestions: true
                            }
                        }
                    }
                },
            },
            take: 5,
            orderBy: [
                {
                    updatedAt: 'desc'
                }
            ]
            

        })
        return quizes
    }
    getMostUnsuccessfulQuizes = async (user: TUser) => {
        const quizes = await prisma.quiz.findMany({
            
            where: {
                userId: user.id,
   
            }
            , include: {
                fillInTheBlankQuiz: {
                    select: {
                        _count: {
                            select: {
                                fillInTheBlankQuestions: true
                            }
                        }
                    }
                },
                multipleChoiceQuiz: {
                    select: {
                        _count: {
                            select: {
                                MultipleChoiceQuestions: true
                            }
                        }
                    }
                },
            },
            take: 5,
            orderBy: [
                {
                    successRate: 'asc'
                }
            ]
            

        })
        return quizes
    }

    quizesPaging = async (data: TQuizesPagingReq,user:TUser) => {
        const quizes = await prisma.quiz.findMany({
            where: {
                userId: user.id,
                id: data.globalSearch ? parseInt(data.globalSearch) : undefined,
                title: {
                    contains: data.title || undefined
                },
                type: data.type as QuestionType || undefined,
                quizSet: {
                    every: {
                        id: {
                            not: data.notQuizSetId
                        }
                    }
                }
            },
            take: data.limit + 1,
            cursor: data.cursor ? {
                id: data.cursor
            } : undefined
        })

        let next = quizes.length > data.limit ? quizes.pop() : null



        return {
            quizes,
            next
        }
    }


    getQuizById = async (id: number) => {
        const quiz = await prisma.quiz.findUnique({
            where: {
                id
            },
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
        })

        return quiz;
    }

    endQuiz = async (data: {
        trueNumber: number,
        falseNumber: number,
        emptyNumber: number,
        quizId: number
    }) => {

        const quiz = await prisma.quiz.findUnique({
            where: {
                id: data.quizId
            },
        })

        if (!quiz) return;


        const thisQuizRate = (data.trueNumber / quiz.questionCount) * 100

        const newSuccsesRate = (((quiz.successRate) * quiz.takenCount) + thisQuizRate) / (quiz.takenCount + 1)

        const s = await prisma.quiz.update({
            where: {
                id: data.quizId,
            },
            data: {
                takenCount: quiz.takenCount + 1,
                successRate: Math.floor(newSuccsesRate)
            }
        })

        console.log(s, 'new QUIz');

        return true

    }

    generateQuiz = async (data: {
        title: string,
        notes?: string,
        questionCount: number,
        userId: string,
    }) => {
        return await mockCreate(data)
    }

    reGenerateQuestion = async (id: number) => {
        const question = await prisma.multipleChoiceQuestion.findUnique({
            where: {
                id

            },
            include: {
                optionsList: true
            }
        })

        await prisma.multipleChoiceQuestion.update({
            where: {
                id
            },
            data: {
                optionsList: {
                    deleteMany: {
                        id: {
                            in: question?.optionsList.map((o) => o.id)
                        }
                    }
                }
            }
        })

        const newQuestion = getRandomQuest();

        const newQuest = await prisma.multipleChoiceQuestion.update({
            where: {
                id
            },
            data: {
                question: newQuestion.question,
                optionsList: {
                    createMany: {
                        data: [
                            {
                                isCorrect: newQuestion.answer === 'A',
                                value: newQuestion.A,
                                opt_index: 0
                            },
                            {
                                isCorrect: newQuestion.answer === 'B',
                                value: newQuestion.B,
                                opt_index: 1
                            },
                            {
                                isCorrect: newQuestion.answer === 'C',
                                value: newQuestion.C,
                                opt_index: 2
                            },
                            {
                                isCorrect: newQuestion.answer === 'D',
                                value: newQuestion.D,
                                opt_index: 3
                            }
                        ]
                    }
                }
            },
            include: {
                optionsList: true
            }
        })

        console.log('***********');
        console.log(newQuest);
        console.log('***********');

        return true



    }

    deleteQuizById = async (id: number) => {
        console.log('ID',id);

        await prisma.quiz.delete({
            where: {
                id
            }
        })
        return true
    }


}


export const getRandomQuest = () => {
    const random = Math.floor(Math.random() * quizesData.length - 1);
    return quizesData[random]
}

export async function mockCreate(data: {
    title: string,
    type?: 'MULTIPLE_CHOICE',
    notes?: string,
    userId: string,
    questionCount: number,
}) {

    const newQuiz = await prisma.quiz.create({
        data: {
            title: data.title,
            type: 'MULTIPLE_CHOICE',
            userId: data.userId,
            questionCount: data.questionCount,
            multipleChoiceQuiz: {
                create: {}
            }
        },
        include: {
            multipleChoiceQuiz: true
        }
    })


    const newMiltipleChocieQuiz = newQuiz.multipleChoiceQuiz;
    if (!newMiltipleChocieQuiz) return


    quizesData.slice(0, data.questionCount).forEach(async (quest) => {

        const newQuest = await prisma.multipleChoiceQuestion.create({
            data: {
                question: quest.question,
                multipleChoiceQuizId: newMiltipleChocieQuiz.id,
                optionsList: {
                    createMany: {
                        data: [
                            {
                                isCorrect: quest.answer === "A",
                                value: quest.A,
                                opt_index: 0
                            },
                            {
                                isCorrect: quest.answer === "B",
                                value: quest.B,
                                opt_index: 1
                            },
                            {
                                isCorrect: quest.answer === "C",
                                value: quest.C,
                                opt_index: 2
                            },
                            {
                                isCorrect: quest.answer === "D",
                                value: quest.D,
                                opt_index: 3
                            }
                        ]
                    }
                }
            }
        })
    })

    const last = await prisma.quiz.findUnique({
        where: {
            id: newQuiz.id,
        },
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
    })

    return last
}
