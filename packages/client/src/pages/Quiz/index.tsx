import MultiQuestionCard from '@/components/Question/MultiQuestionCard';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Prisma } from '@prisma/client'
import Spinner from '@/components/ui/Spinner';
import { AlertCircle, Check, RotateCw, XCircle } from 'lucide-react';

import { Progress } from "@/components/ui/progress"
import { useQueryClient } from '@tanstack/react-query';


interface IQuizProps {
    children?: React.ReactNode | React.ReactNode[];
}

type TQuestion = Prisma.MultipleChoiceQuestionGetPayload<{
    include: {
        optionsList: true
    }
}>

const Quiz = ({ }: IQuizProps) => {
    const params = useParams<{ id: string }>()
    const queryClient = useQueryClient();


    const id = Number(params.id)

    const { data: quizData } = trpc.quiz.getQuiz.useQuery(id)
    console.log(quizData);

    console.log('qwe213123');

    const [currStep, setCurrStep] = useState("initialStep")
    const [answers, setAnswers] = useState<{
        answerIndex?: number,
        questionId: number,
        isCorrect?: boolean,
        isAnswered: boolean
    }[]>([])

    useEffect(() => {
        if (quizData && answers.length == 0) {
            const newAnswers = quizData.multipleChoiceQuiz!.
                MultipleChoiceQuestions.map((quest) => {
                    return {
                        answerIndex: undefined,
                        questionId: quest.id,
                        isCorrect: undefined,
                        isAnswered: false

                    }
                })
            setAnswers(newAnswers);
        }
    }, [quizData])

    console.log(answers);



    const [results, setResults] = useState<{
        trueNumber: number,
        falseNumber: number,
        emptyNumber: number,
    } | null>(null)

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

    const currentQuestionData: TQuestion | undefined = quizData?.multipleChoiceQuiz?.MultipleChoiceQuestions[currentQuestionIndex]

    const { mutateAsync: endQuiz, isLoading: isEndQuizMutating } = trpc.quiz.endQuiz.useMutation({
        onSuccess: () => {
            setCurrStep('FinalStep')
            // queryClient.invalidateQueries()
        }
    });

    let currentQuestion;

    const onSelectOption = (newIndex: number) => {
        if (!currentQuestionData) return;

        const quest = answers.find(ans => ans.questionId == currentQuestionData.id)

        if (quest?.isAnswered) return;

        quest!.answerIndex = newIndex;
        quest!.isCorrect = currentQuestionData.optionsList[newIndex].isCorrect
        quest!.isAnswered = true;
        setAnswers([...answers])
    }

    if (currentQuestionData) {
        currentQuestion = (
            <MultiQuestionCard
                onSelectOption={onSelectOption}
                question={currentQuestionData!.question}
                options={currentQuestionData!.optionsList.map(option => {
                    return {
                        value: option.value,
                        isCorrect: option.isCorrect
                    }
                })}
                number={currentQuestionIndex+1}
                selectedIndex={answers.find(ans => ans.questionId == currentQuestionData?.id)?.answerIndex}

            />
        )
    }

    const navigate = useNavigate();


    //variables

    const questionsCount = quizData?.multipleChoiceQuiz?.MultipleChoiceQuestions.length || 0

    const STEPS: {
        [key: string]: any
    } = {
        "initialStep": (
            <div className='flex flex-col gap-3'>
                <h2 className='text-xl'>{quizData?.title}</h2>
                <div>You solved it {quizData?.takenCount} Times</div>
                <div>
                    <div>Succsess Rate:</div>
                    <Progress indicatorClassName='bg-green-500' className='w-full bg-slate-200 text-blue-600'
                        // value={successRate}
                        value={quizData?.successRate}
                    >
                    </Progress>

                </div>
                <div className='mt-2'>
                    <Button onClick={() => {
                        setCurrStep('quizStep')
                        setCurrentQuestionIndex(0)
                    }}>
                        Start Quiz
                    </Button>
                </div>


            </div>
        ),
        "FinalStep": (
            <div className='flex flex-col gap-3'>
                <h2 className='font-semibold text-xl mb-4'>Quiz Ended, Here Your Results </h2>
                <div className='flex items-center gap-2'>
                    <div className='w-8 h-8 border rounded-full flex items-center justify-center text-green-500'><Check /></div>
                    <div className='w-16'>True:</div>
                    <div className="">{results?.trueNumber}</div>
                </div>

                <div className='flex items-center gap-2'>
                    {/* <div className='w-8 h-8 border rounded-full flex items-center justify-center text-red-700'> */}
                    <XCircle className='w-8 h-8 text-red-600' />
                    {/* </div> */}
                    <div className='w-16'>False:</div>
                    <div className="">{results?.falseNumber}</div>
                </div>

                <div className='flex items-center gap-2'>
                    <AlertCircle className='w-8 h-8 text-slate-500' />
                    <div className='w-16'>Empty:</div>
                    <div className="">{results?.emptyNumber}</div>
                </div>
                <div className='mt-2'>
                    <Button onClick={() => {
                        navigate('/quiz/1', {
                            state: {
                                remount: true
                            }
                        })
                    }}>

                        Solve Again !
                        <RotateCw className='w-4 ml-2' />
                    </Button>
                </div>
            </div>
        ),
        "quizStep": currentQuestion
    }

    console.log(currentQuestionData);


    const onEndQuiz = () => {
        const trueNumber = answers.filter(ans => ans.isCorrect).length
        const emptyNumber = answers.filter(ans => ans.answerIndex === undefined).length
        const falseNumber = answers.length - (trueNumber + emptyNumber);
        setResults({ trueNumber, emptyNumber, falseNumber })
        endQuiz({
            quizId: id,
            trueNumber,
            falseNumber,
            emptyNumber
        })
    }

    return (
        <div about='component flex' className='' >
            <div className='max-w-[600px]  flex flex-col gap-3'>

                {
                    STEPS[currStep]
                }
                {
                    currStep === 'quizStep' &&
                    <div className='flex justify-between'>
                        <div className='c c1 flex gap-4'>
                            <Button
                                disabled={currentQuestionIndex == 0}
                                onClick={() => {
                                    setCurrentQuestionIndex(currentQuestionIndex - 1)

                                }}
                            >Prev</Button>
                            <Button
                                disabled={currentQuestionIndex + 1 === quizData?.multipleChoiceQuiz?.MultipleChoiceQuestions.length}
                                onClick={() => {
                                    setCurrentQuestionIndex(currentQuestionIndex + 1)
                                }}
                            >Next</Button>
                        </div>
                        <div className='c c2'>
                            <Button
                                disabled={isEndQuizMutating}
                                onClick={onEndQuiz}
                            >
                                End Quiz
                                <Spinner isSpinning={isEndQuizMutating} />
                            </Button>
                        </div>

                    </div>
                }
            </div>
        </div>

    )
}
export default Quiz;