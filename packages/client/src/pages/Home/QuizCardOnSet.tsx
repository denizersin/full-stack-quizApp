import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

import { QuestionTypeEnum } from "@/lib/constants";
import { trpc } from "@/lib/trpc";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { Minus, Play, Plus } from "lucide-react";
import React from 'react'
import { Prisma } from '@prisma/client'
import { useNavigate } from "react-router-dom";


type TQuizSet = Prisma.QuizSetGetPayload<
    {
        include: {
            quizzes: {
                include: {
                    fillInTheBlankQuiz: true,
                    multipleChoiceQuiz: true
                }
            }
        }
    }>


interface IQuizCardOnSetProps {
    children?: React.ReactNode | React.ReactNode[];
    title: string,
    type: keyof typeof QuestionTypeEnum,
    successRate: number,
    id: number,
    takenCount: number,
    count?: number,
    isExistOnSet: boolean,
    mutationKey: (string | number)[],
    quizSet: TQuizSet,
    onSucessAddOrRemove?: () => void
}

const QuizCardOnSet = ({
    title,
    type,
    successRate,
    id,
    takenCount,
    count,
    isExistOnSet,
    mutationKey,
    quizSet,
    onSucessAddOrRemove
}: IQuizCardOnSetProps) => {
    const navigate = useNavigate()
    const queryCLient = useQueryClient();

    console.log(successRate, 'successRate');

    const { mutateAsync: addQuiz } = trpc.quizSet.addQuiz.useMutation({
        onSuccess: () => {
            queryCLient.invalidateQueries([mutationKey])
            onSucessAddOrRemove && onSucessAddOrRemove()
        }
    })

    const { mutateAsync: removeQuiz } = trpc.quizSet.removeQuiz.useMutation({
        onSuccess: () => {
            queryCLient.invalidateQueries([mutationKey])
            onSucessAddOrRemove && onSucessAddOrRemove()
        }
    })


    const handleAction = (action: string) => {

        if (action === 'remove') {
            removeQuiz({
                quizId: id,
                quizSetId: quizSet.id,

            })
        }

        if (action == 'play') {

            navigate('/quiz/' + id)

        }
        if (action == 'add') {

            addQuiz({
                quizSetId: quizSet.id,
                quizId: id
            })
        }


    }


    return (
        <Card className='w-64 border-slate-100 border-[.7px] rounded-xl'>
            <CardHeader className=" flex items-center flex-row justify-between">
                <CardTitle className="">{title}</CardTitle>
                {isExistOnSet && (
                    <div className="w-12 h-12 flex justify-center items-center">
                        <Button
                            onClick={() => handleAction('remove')}
                            variant={'outline'}
                            className="rounded-full w-8 h-8 p-0  border-red-500 flex items-center justify-center">
                            <Minus className="w-4" />
                        </Button>
                    </div>

                )}
            </CardHeader>
            <CardContent className='flex flex-col items-start gap-1'>
                <div>
                    {QuestionTypeEnum[type]}
                </div>
                <div>
                    <Progress indicatorClassName='bg-green-500' className='w-20 bg-slate-200 text-blue-600'
                        value={successRate}
                    >
                    </Progress>
                </div>
                <div className='flex  w-full justify-between'>
                    <div className="c grow flex flex-col text-xs justify-center">
                        <div>
                            Taken:{takenCount}
                        </div>
                        {/* {count&& <div>
                            Questions:
                            {count}
                        </div>} */}
                    </div>
                    <div className='w-max'>
                        <Button
                            onClick={() => {
                                handleAction(isExistOnSet ? 'play' : 'add')
                            }}
                            variant={isExistOnSet ? 'default' : 'outline'}
                            className='rounded-full w-12 h-12 p-0 flex items-center justify-center'>
                            {
                                isExistOnSet ?
                                    <Play className='w-7 ml-1' /> :
                                    <Plus className='w-7' />
                            }
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
export default QuizCardOnSet;