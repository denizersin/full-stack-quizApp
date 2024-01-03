import React from 'react'


import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Calendar as CalendarIcon } from "lucide-react"
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
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { trpc } from '@/lib/trpc'
import { useNavigate } from 'react-router-dom'

const formSchema = z.object({
    email: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    password: z.string().min(10, {
        message: "Password must be at least 10 characters.",
    }),
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    surname: z.string().min(2, {
        message: "Surname must be at least 2 characters.",
    }),
    birthDate: z.date(),
    identityNumber: z.string().min(11, {
        message: "Identity Number must be at least 11 characters.",
    },).max(11, { message: "Identity Number must be at most 11 characters." }),


})
interface IRegisterProps {
    children?: React.ReactNode | React.ReactNode[];
}
export function Register({ }: IRegisterProps) {
    // ...
    const navigate = useNavigate();
    const registerMutation = trpc.auth.register.useMutation({
        onSuccess: () => {

        }
    });


    const { mutateAsync: register, data } = registerMutation;
    console.log(data);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            name: "",
            surname: "",
            identityNumber: ""

        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
        register(values)

    }

    return (
        <div className=' w-full  flex items-center justify-center p-2 md:p-6 '>

            <div className=' w-[500px] mt-20 shadow-md p-8 py-10 '>
                {

                }
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="surname"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Surname</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Surname" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="birthDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='block mb-2'>Birth Date</FormLabel>
                                    <FormControl>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-[280px] justify-start text-left font-normal",
                                                        // !date && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {form.getValues('birthDate') ? form.getValues('birthDate').toLocaleDateString() : <span>Pick a date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-full p-0">
                                                <Calendar
                                                    className='w-full'
                                                    {...field}
                                                    mode="single"
                                                    onSelect={(e) => {
                                                        field.onChange(e)
                                                    }}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="identityNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Identity Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Iidentity Number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="shadcn" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            </div>
        </div>

    )
}

