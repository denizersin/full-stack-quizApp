import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from '@/components/ui/textarea'

const formSchema = z.object({
    quizName: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    notes: z.string().min(100, {
        message: "Username must be at least 100 characters.",
    })
})

interface ICreateQuizProps {
    children?: React.ReactNode | React.ReactNode[];
}

const CreateQuiz = ({ }: ICreateQuizProps) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            quizName: "",
            notes: "",
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
    }

    return (
        <div about='component' className='max-w-full w-full flex flex-col' >
            <div className='text-xl font-semibold'>Create Quiz</div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full max-w-[700px]">
                    <FormField
                        control={form.control}
                        name="quizName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>QuizName</FormLabel>
                                <FormControl>
                                    <Input className='' placeholder="shadcn" {...field} />
                                </FormControl>
                                {/* <FormDescription>
                                    This is your public display name.
                                </FormDescription> */}
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Your Notes</FormLabel>
                                <FormControl>
                                    <Textarea className='min-h-[24rem]' placeholder="shadcn" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Add your notes here .
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div>
                        <span className='text-muted-foreground'>Soon*</span>
                        <Button disabled={true} className='w-full' variant={'outline'}>Add document or image</Button>
                    </div>

                    <Button type="submit">Create</Button>
                </form>
            </Form>
        </div>
    )
}
export default CreateQuiz;