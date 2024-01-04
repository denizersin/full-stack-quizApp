import { Button, buttonVariants } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

import { Play } from 'lucide-react';
import { ProgressIndicator } from '@radix-ui/react-progress';
import { QuestionTypeEnum } from '@/lib/constants';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import QuizCard from './QuizCard';
import { useQueryClient } from '@tanstack/react-query';
import { getQueryKey } from '@trpc/react-query';
interface IHomeProps {
    children?: React.ReactNode | React.ReactNode[];
}

const Home = ({ }: IHomeProps) => {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [idWillDelete, setIdWillDelete] = useState(-1)

    const { data } = trpc.quiz.getQuizes.useQuery()

    const { data: recentQuizes } = trpc.quiz.getRecentQuiz.useQuery()

    const { data: mostUnsuccesQuizes } = trpc.quiz.getMostUnsuccessfulQuiz.useQuery()


    const queryClient = useQueryClient();

    const navigate = useNavigate()

    const { mutateAsync: deleteQuiz } = trpc.quiz.deleteQuiz.useMutation({
        onSuccess: () => {
            queryClient.invalidateQueries(getQueryKey(trpc.quiz.getQuizes))
            setIdWillDelete(-1);
            setIsDeleteDialogOpen(false)
        }
    })

    const onDelteQuiz = (id: number) => {
        setIsDeleteDialogOpen(true)
        setIdWillDelete(id)
    }
    const onEditQuiz = (id: number) => {
        navigate(`/quiz/edit/${id}`)
    }

    console.log(data);


    return (
        <div about='component' className='' >

            <div>
                <Link to={'/create-quiz'}
                    className={buttonVariants()}
                >Create Quiz</Link>
            </div>

            <h2 className='my-3 text-2xl'>Last Taken Quizes</h2>

            <div className='quizes flex gap-4 flex-wrap mt-4'>
                {
                    recentQuizes?.map((quiz) => {
                        return (
                            <QuizCard
                                title={quiz.title}
                                id={quiz.id}
                                count={quiz.questionCount}
                                type={quiz.type}
                                successRate={quiz.successRate}
                                takenCount={quiz.takenCount}
                                onDelete={onDelteQuiz}
                                onEdit={onEditQuiz}
                            />
                        )
                    })
                }
            </div>

            <h2 className='my-3 text-2xl text-red-400 dark:text-red-300'>Most Unsuccessful Quizes</h2>


            <div className='quizes flex gap-4 flex-wrap mt-4'>
                {
                    mostUnsuccesQuizes?.map((quiz) => {
                        return (
                            <QuizCard
                                title={quiz.title}
                                id={quiz.id}
                                count={quiz.questionCount}
                                type={quiz.type}
                                successRate={quiz.successRate}
                                takenCount={quiz.takenCount}
                                onDelete={onDelteQuiz}
                                onEdit={onEditQuiz}
                            />
                        )
                    })
                }
            </div>




            {/* Modals */}
            <AlertDialog
                open={isDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your quiz
                            and remove your data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={() => setIsDeleteDialogOpen(false)}
                        >Cancel</AlertDialogCancel>
                        <Button
                            onClick={() => deleteQuiz({ id: idWillDelete })}
                            variant={'destructive'}>Delete</Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
export default Home;