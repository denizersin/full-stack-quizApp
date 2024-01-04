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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { QuestionTypeEnum } from "@/lib/constants";
import { Delete, MoreVertical, Play, Plus } from "lucide-react";
import React from 'react'
import { useNavigate } from "react-router-dom";


type Action = "START" | "ADD-TO-SET"

interface IQuizCardProps {
    children?: React.ReactNode | React.ReactNode[];
    title: string,
    type: keyof typeof QuestionTypeEnum,
    successRate: number,
    id: number,
    takenCount: number,
    count?: number,
    onDelete?: (id: number) => void,
    onEdit?: (id: number) => void,
}

const QuizCard = ({
    title,
    type,
    successRate,
    id,
    takenCount,
    count,
    onDelete,
    onEdit

}: IQuizCardProps) => {

    const hasAnyAction = onDelete || onEdit

    const ACTION_ICON_MAP: {
        [key in Action]: any
    } = {
        START: <Play className='w-7 ml-1' />,
        "ADD-TO-SET": <Plus className='w-7 ' />
    }

    const navigate = useNavigate();

    return (
        <Card className='w-64 dark:border-slate-100 dark:border-[.7px]'>
            <CardHeader className=" flex items-center flex-row justify-between">

                <CardTitle>{title}</CardTitle>
                {hasAnyAction && <DropdownMenu>
                    <DropdownMenuTrigger className='w-8 h-8 p-0 flex items-center justify-center hover:bg-muted rounded-full '>
                        <MoreVertical className="w-6 h-6" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className='mr-4'>
                        <DropdownMenuLabel>Quiz Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer" onClick={() => onEdit!(id)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" onClick={() => onDelete!(id)}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>}
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
                <div className='flex  w-full'>
                    <div className="c grow flex flex-col text-xs justify-center">
                        <div>
                            Taken:{takenCount}
                        </div>
                        {count && <div>
                            Questions:
                            {count}
                        </div>}
                    </div>
                    <div className='w-max'>
                        <Button
                            onClick={() => navigate(`/quiz/${id}`)}
                            className='rounded-full w-12 h-12 p-0 flex items-center justify-center'>
                            <Play className='w-7 ml-1' />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
export default QuizCard;