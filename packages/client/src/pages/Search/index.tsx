import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { trpc } from '@/lib/trpc';
import { useQueryClient } from '@tanstack/react-query';
import { getQueryKey } from '@trpc/react-query';
import { Edit, ShieldClose, SidebarClose, X } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import QuizCard from '../Home/QuizCard';
import QuizCardOnSet from '../Home/QuizCardOnSet';
import { QuestionType } from "@prisma/client";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

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


interface IindexProps {
    children?: React.ReactNode | React.ReactNode[];
}

const index = ({ }: IindexProps) => {

    //get slug from react router

    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const [titleFilter, setTitleFilter] = useState('')
    const [typeFilter, setTypeFilter] = useState('all')
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [idWillDelete, setIdWillDelete] = useState(-1)
    const params = useParams<{ id: string }>()
    const id = Number(params.id)







    const { data: quizesToAdd, fetchNextPage, refetch } = trpc.quiz.paging.useInfiniteQuery(
        {
            limit: 10,
            title: titleFilter,
            type: typeFilter === 'all' ? undefined : typeFilter
        },
        {
            getNextPageParam: (lastPage) => lastPage.next?.id,
            // initialCursor: 1, // <-- optional you can pass an initialCursor
        },
    )
    const hasNextPage = quizesToAdd?.pages[quizesToAdd.pages.length - 1]?.next









    const onSucessAddOrRemove = () => {
        refetch()
    }

    const fetchNextPage2 = () => {

        if (!hasNextPage) return;

        fetchNextPage()
    }

    const { mutateAsync: deleteQuiz } = trpc.quiz.deleteQuiz.useMutation({
        onSuccess: () => {
            queryClient.invalidateQueries(getQueryKey(trpc.quiz))
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



    return (
        <div about='component' className='' >

            <h2 className='text-2xl my-4'>Your Quizes</h2>

            <div className='flex gap-2'>
                <Input placeholder='Search Title' className='w-52' value={titleFilter} onChange={(e) => setTitleFilter(e.target.value)} />

                <Select
                    defaultValue='all'
                    onValueChange={(val) => { setTypeFilter(val) }}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a quiz type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Type</SelectLabel>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value={QuestionType['MULTIPLE_CHOICE']}>Multiple Chocie</SelectItem>
                            <SelectItem value={QuestionType['FILL_IN_THE_BLANK']}>Fill In The Blank</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <div className='quizes flex gap-4 flex-wrap mt-4'>

                {
                    quizesToAdd?.pages.map(page => {
                        return page.quizes.map((quiz) => {
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

                    })
                }
                {/* {
                    data?.map((quiz) => {
                        return (
                            <QuizCardOnSet
                                mutationKey={mutationKey}
                                title={quiz.title}
                                id={quiz.id}
                                count={quiz.fillInTheBlankQuiz?._count.fillInTheBlankQuestions! ||
                                    quiz.multipleChoiceQuiz?._count.MultipleChoiceQuestions!
                                }
                                type={quiz.type}
                                successRate={quiz.successRate}
                                takenCount={quiz.takenCount}
                                isExistOnSet={false}
                                quizSet={quizSet}
                            />
                        )
                    })
                } */}
            </div>
            <div className='w-full flex justify-center my-4'>
                {hasNextPage && <Button
                    className='w-64'
                    onClick={() => fetchNextPage2()}
                    variant={'outline'}>
                    Load More
                </Button>
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
                            onClick={() => deleteQuiz({ id:idWillDelete })}
                            variant={'destructive'}>Delete</Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </div>
    )
}
export default index;