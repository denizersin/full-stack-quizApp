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

    const queryCLient = useQueryClient();
    const navigate = useNavigate();

    const [titleFilter, setTitleFilter] = useState('')
    const [typeFilter, setTypeFilter] = useState('all')
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    const params = useParams<{ id: string }>()
    const id = Number(params.id)

    const utils = trpc.useUtils();

    console.log(getQueryKey(trpc.quizSet.getQuizSetById));



    //if undefined return 404

    const mutationKey = getQueryKey(trpc.quizSet.getQuizSetById)[0]
    console.log(mutationKey, 'w');

    console.log(getQueryKey(trpc.quiz.paging)[0][0], 'key');

    const KEY = getQueryKey(trpc.quiz.paging)[0]

    const { data: quizSet } = trpc.quizSet.getQuizSetById.useQuery(id, {
    })

    const key = getQueryKey(trpc.quiz.paging)[0]
    console.log(key, 'paging key');

    const { mutateAsync: updateQuizSet } = trpc.quizSet.updateQuizSetById.useMutation({
        onSuccess: (data) => {
            setIsEditTitle(!isEditTitle)
            queryCLient.invalidateQueries([mutationKey])
            queryCLient.invalidateQueries({
                queryKey: getQueryKey(trpc.quiz.paging),
            })
            refetch()
            console.log('******');
        }
    })

    const { mutateAsync: deleteQuiz } = trpc.quizSet.deleteQuizSetById.useMutation({
        onSuccess: () => {
            navigate('/');
            queryCLient.invalidateQueries(getQueryKey(trpc.quizSet))
        }
    })

    const { data: quizesToAdd, fetchNextPage, refetch } = trpc.quiz.paging.useInfiniteQuery(
        {
            limit: 10,
            notQuizSetId: id,
            title: titleFilter,
            type: typeFilter === 'all' ? undefined : typeFilter
        },
        {
            getNextPageParam: (lastPage) => lastPage.next?.id,
            // initialCursor: 1, // <-- optional you can pass an initialCursor
        },
    )
    const hasNextPage = quizesToAdd?.pages[quizesToAdd.pages.length - 1]?.next


    console.log(quizesToAdd, 'here');

    const [isEditTitle, setIsEditTitle] = useState(false)
    const [newTitle, setNewTitle] = useState("")



    const onUpdateQuizSet = () => {

        updateQuizSet({
            id: id,
            title: newTitle
        })

    }

    useEffect(() => {
        if (!isEditTitle) setNewTitle(quizSet?.title ?? "")
    }, [isEditTitle, quizSet?.title])


    const onSucessAddOrRemove = () => {
        refetch()
    }

    const fetchNextPage2 = () => {

        if (!hasNextPage) return;

        fetchNextPage()
    }

    console.log(hasNextPage, 'has');


    return (
        <div about='component' className='' >

            <div className='head h-20 pt-1'>
                {
                    isEditTitle ? <>
                        <div className='flex gap-2'>
                            <Input className='w-64' autoFocus={true} value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
                            <Button variant={'outline'} className='w-max'
                                onClick={onUpdateQuizSet}
                            >Save</Button>
                            <Button variant={'outline'} className='w-max cursor-pointer'
                                onClick={() => setIsEditTitle(!isEditTitle)}
                            >
                                <X />
                            </Button>

                            <Button onClick={() => setIsDeleteDialogOpen(true)} variant={'destructive'}>
                                Delete Set
                            </Button>
                        </div>
                    </> : <div className='flex gap-2'>
                        <span className='w-64'>
                            {quizSet?.title}
                        </span>
                        <Edit className='cursor-pointer ml-8' onClick={() => setIsEditTitle(!isEditTitle)} />
                    </div>
                }
            </div>
            <h2 className='text-2xl my-4'>Added</h2>
            <div className='added quizes flex gap-4 flex-wrap mt-4'>
                {
                    quizSet?.quizzes?.map((quiz) => {
                        return (
                            <QuizCardOnSet
                                title={quiz.title}
                                id={quiz.id}
                                type={quiz.type}
                                successRate={quiz.successRate}
                                takenCount={quiz.takenCount}
                                isExistOnSet={true}
                                mutationKey={mutationKey}
                                quizSet={quizSet}
                                onSucessAddOrRemove={onSucessAddOrRemove}
                            />
                        )
                    })
                }
            </div>


            <div className="recommended/search">

            </div>
            <h2 className='text-2xl my-4'>Recommended</h2>

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
                                <QuizCardOnSet
                                    mutationKey={mutationKey}
                                    title={quiz.title}
                                    id={quiz.id}
                                    count={quiz.questionCount!}
                                    type={quiz.type}
                                    successRate={quiz.successRate}
                                    takenCount={quiz.takenCount}
                                    isExistOnSet={false}
                                    quizSet={quizSet}
                                    onSucessAddOrRemove={onSucessAddOrRemove}
                                />
                            )
                        })

                    })
                }

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
                            This action cannot be undone. This will permanently delete your quiz set
                            and remove your data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={() => setIsDeleteDialogOpen(false)}
                        >Cancel</AlertDialogCancel>
                        <Button
                            onClick={() => deleteQuiz({ id })}
                            variant={'destructive'}>Delete</Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </div>
    )
}
export default index;