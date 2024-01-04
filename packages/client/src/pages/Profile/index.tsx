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

import { Input } from "@/components/ui/input"
import { trpc } from '@/lib/trpc'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/components/ui/use-toast'
import { useQueryClient } from '@tanstack/react-query'
import { getQueryKey } from '@trpc/react-query'
import useUser, { useSession } from '@/Hooks/useAuth'


interface IProfileProps {
    children?: React.ReactNode | React.ReactNode[];
}
export default function Profile({ }: IProfileProps) {

    const session = useSession()
    const user = session?.user

    const formSchema = z.object({
        email: z.string().email(),
        password: z.string().min(10, {
            message: "Password must be at least 10 characters.",
        }),
        name: z.string().optional(),
        surname: z.string().optional(),
        birthDate: z.string().optional(),
        identityNo: z.string().optional(),
    })

    // ...
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const updateUserMutation = trpc.quiz.updateUser.useMutation({
        onSuccess: () => {
            toast({
                variant: "default",
                title: "Successfully Updated",
                // action: <ToastAction altText="Try again">Try again</ToastAction>,
            })
            queryClient.invalidateQueries(getQueryKey(trpc.auth.getSession));

        },
        onError: (error) => {
            console.log(error.message);
            toast({
                variant: "destructive",
                title: error.message,
                // action: <ToastAction altText="Try again">Try again</ToastAction>,
            })
        }
    });

    const { toast } = useToast()

    const { mutateAsync: register, data } = updateUserMutation;
    console.log(data);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: user?.email,
            password: "",
            name: user?.name,
            surname: user?.surname,
            identityNo: user?.identityNo,
            birthDate: user?.birthDate

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

            <div className=' w-[500px]  shadow-md p-8 py-10 '>
                {

                }
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="name"
                            disabled={true}
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
                            disabled={true}

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
                            disabled={true}

                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Birth Year</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Iidentity Number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="identityNo"
                            disabled={true}

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
                                        <Input
                                        type='password'
                                        placeholder="shadcn" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Update</Button>
                    </form>
                </Form>
            </div>
        </div>

    )
}

