import { trpc } from '@/lib/trpc';
import React, { useState } from 'react'
import { useLocation, useParams } from 'react-router-dom';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { MultiOptionIndexEnum2 } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Bot } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { getQueryKey } from '@trpc/react-query';
import GenerateAnimate from './GenerateAnimate';


interface IEditQuizProps {
    children?: React.ReactNode | React.ReactNode[];
}

const EditQuiz = ({ }: IEditQuizProps) => {
    const location = useLocation()
    const initialData = location?.state?.quiz
    console.log(initialData, 'qwewqeinitial');
    const params = useParams()
    const id = Number(params?.id)

    const [regeneratedQuestId, setregeneratedQuestId] = useState<number>(-1)

    const queryClient = useQueryClient()

    const { data: quizData, refetch } = trpc.quiz.getQuiz.useQuery(id, {
        initialData
    })
    const queryKey = getQueryKey(trpc.quiz.getQuiz)

    const { mutateAsync: regenerateQuest } = trpc.quiz.generateNewQuestion.useMutation({
        onSuccess: () => {
            queryClient.invalidateQueries(queryKey)
            // refetch();
            setMap({
                ...map,
                [regeneratedQuestId]: map[regeneratedQuestId] ? map[regeneratedQuestId] + 31 : 1
            })
        }
    })

    const onRegenerate = (id: number) => {
        regenerateQuest({
            questId: id
        })
        setregeneratedQuestId(id)

    }






    const [map, setMap] = useState<
        {
            [key: number]: number
        }
    >({

    })
    console.log(quizData, 'qwe');

    console.log(map);

    console.log(regeneratedQuestId, 'regeneratedQuestId');

    return (
        <div about='component' className=' pb-10 ' >
            <div about='23' className='questions flex flex-col gap-3 max-w-[800px]'>

                {
                    quizData?.multipleChoiceQuiz?.MultipleChoiceQuestions?.map((question, index) => {

                        const key = map[question.id]
                        return <Card >
                            <CardHeader className='flex flex-row justify-between'>
                                <CardTitle>  {(index + 1) + ') '}
                                    {question.question}
                                    <GenerateAnimate animateInitial={initialData} text={question.question} refreshKey={key} />
                                </CardTitle>
                                <Button onClick={() => onRegenerate(question.id)} variant={'outline'} className='!mt-0 text-sm px-1'>Re generate <Bot className='ml-1' /></Button>
                            </CardHeader>
                            <CardContent className='flex flex-col gap-2'>
                                {
                                    question.optionsList.map((option, index) => {
                                        return (
                                            <div
                                                className={cn('flex gap-1 border rounded-lg p-2 cursor-pointer', {
                                                })}>
                                                <div className="w-[2rem] h-[2rem] shrink-0  rounded-full border flex justify-center items-center">{MultiOptionIndexEnum2[index]}</div>
                                                <div className="option  px-2">
                                                    <GenerateAnimate animateInitial={initialData} text={option.value} refreshKey={key} />
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </CardContent>
                        </Card>
                    })

                }
            </div>


        </div>
    )
}
export default EditQuiz;