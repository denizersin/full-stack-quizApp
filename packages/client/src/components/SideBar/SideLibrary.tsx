import { ArrowRight, LibraryBig, Plus } from 'lucide-react';
import React, { useContext, useEffect, useRef } from 'react'
import { EXPANDED_SIDEBAR_WIDTH, INITIAL_SIDEBAR_WIDTH, SideBarWidthContext } from './SideBar';
import { cn } from '@/lib/utils';
import { ScrollArea } from "@/components/ui/scroll-area"
import { trpc } from '@/lib/trpc';
import { Link, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { getQueryKey } from '@trpc/react-query';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from '../ui/button';
interface ISideLibraryProps {
    children?: React.ReactNode | React.ReactNode[];
}

const SideLibrary = ({ }: ISideLibraryProps) => {



    const { width, setWidth, isExpanded } = useContext(SideBarWidthContext)

    console.log(width);

    const { data: quizLists } = trpc.quizSet.getQuizSet.useQuery();

    console.log(quizLists, 'we');

    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { isLoading, mutateAsync: createSet } = trpc.quizSet.createQuizSet.useMutation({
        onSuccess: (data) => {
            console.log(data);
            navigate(`/quiz-set/${data.id}`)
            queryClient.invalidateQueries(getQueryKey(trpc.quizSet));
        }
    })
    const onCreateQuizSet = () => {
        if (isLoading) return;
        createSet({})
    }



    const { data: newQuizList, fetchNextPage } = trpc.quizSet.quizSetPaging.useInfiniteQuery(
        {
            limit: 10,
        },
        {
            getNextPageParam: (lastPage) => lastPage.next?.id,
            // initialCursor: 1, // <-- optional you can pass an initialCursor
        },
    )


    console.log(newQuizList, 'new');
    const scrollRef = useRef<HTMLDivElement>(null)


    console.log(scrollRef.current);



    const onScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
        const element = e.target as HTMLDivElement;
        if (element.scrollTop + 250 > scrollRef.current?.offsetHeight!) {
            fetchNextPage2()
        }
    }


    const fetchNextPage2 = () => {
        const hasNextPage = newQuizList?.pages[newQuizList.pages.length - 1]?.next

        if (!hasNextPage) return;

        fetchNextPage()
    }

    return (
        <div about='component' className='mt-4 h-full max-h-full  flex flex-col ' >

            <div className='top-head max-w-full pr-6'>

                <div className="row1  flex justify-between">
                    <div className="left title flex">
                        <LibraryBig strokeWidth={'0.8px'} />
                        <span className='ml-2'> Your Library</span>
                    </div>
                    <div className="right flex items-center">
                        <div
                            onClick={onCreateQuizSet}
                            className="rounder p-1 rounded-full hover:bg-muted cursor-pointer">
                            <Plus className='' />
                        </div>
                        <ArrowRight
                            onClick={() => isExpanded ? setWidth(INITIAL_SIDEBAR_WIDTH) : setWidth(EXPANDED_SIDEBAR_WIDTH)}
                            className={cn('ml-2 cursor-pointer',
                                {
                                    'rotate-180': isExpanded
                                })} />
                    </div>
                </div>

                <div className="row2 category-pills flex mt-2">
                    {
                        new Array(4).fill(0).map((_, i) => (
                            <div key={i} className="p-1 px-2 rounded-full bg-secondary text-secondary-foreground  text-xs mr-2 mb-2 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700">
                                {`Category`}
                            </div>
                        ))
                    }
                </div>
            </div>


            <ScrollArea onScrollCapture={onScroll} ref={scrollRef} className="overflow-y-scroll h-full mr-1 pr-6">
                <div className='flex flex-col gap-1'>
                    {
                        newQuizList?.pages.map(page => <>
                            {
                                page.quizSets.map((quizSet) => (
                                    <Link to={`/quiz-set/${quizSet.id}`} className='h-[4rem] border rounded-sm flex items-center gap-2 px-2  hover:bg-muted cursor-pointer'>
                                        <div className="c c1">
                                            <img
                                                className='w-11 h-11 rounded-sm'
                                                src="https://t.pimg.jp/082/530/246/1/82530246.jpg" alt="" />
                                        </div>
                                        <div className="c c2">
                                            {quizSet.title}
                                        </div>
                                    </Link>))
                            }
                        </>)


                        //     ))
                    }
                </div>

            </ScrollArea>
            <div className='  flex w-full  pr-7 mt-2'>
                <Button className='w-full rounded-none' onClick={fetchNextPage2} variant={'outline'}>Load More</Button>
            </div>

        </div>
    )
}
export default SideLibrary;