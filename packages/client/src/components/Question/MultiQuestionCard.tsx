import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { cn } from '@/lib/utils';
import { MultiOptionIndexEnum, MultiOptionIndexEnum2 } from '@/lib/constants';
interface IMultiQuestionCardProps {
    onSelectOption: (optionIndex: number) => void,
    options: {
        value: string,
        isCorrect: boolean
    }[]
    ,
    number?: number | string,
    selectedIndex?: number,
    children?: React.ReactNode | React.ReactNode[];
    containerClassName?: React.HTMLProps<HTMLElement>["className"];
    question: string,
}

const MultiQuestionCard = ({
    number,
    options,
    onSelectOption,
    selectedIndex,
    containerClassName,
    question,

}: IMultiQuestionCardProps) => {


    console.log(selectedIndex, 'selected');

    return (
        <Card className={cn(containerClassName)}>
            <CardHeader>
                <CardTitle>{`${number ? number + ')   ' : ''}`} {question}  </CardTitle>
            </CardHeader>
            <CardContent className='flex flex-col gap-2'>
                {
                    options.map((option, index) => {
                        const isTrue = selectedIndex == index && option.isCorrect
                        const isFalse = selectedIndex == index && !option.isCorrect
                        const indexLetter = MultiOptionIndexEnum2[index]
                        return (
                            <div
                                onClick={() => onSelectOption(index)}
                                className={cn('flex gap-1 border rounded-lg p-2 cursor-pointer', {
                                    'bg-red-400': isFalse,
                                    'bg-green-300': isTrue
                                })}>
                                <div className="w-[2rem] h-[2rem] shrink-0  rounded-full border flex justify-center items-center">{indexLetter}</div>
                                <div className="option  px-2">{option.value} </div>
                            </div>
                        )
                    }
                    )
                }
            </CardContent>
        </Card>
    )
}
export default MultiQuestionCard;