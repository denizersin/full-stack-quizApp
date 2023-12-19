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
import { trpc } from '@/lib/trpc'
import { Link, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { getQueryKey } from '@trpc/react-query'
import Spinner from '@/components/ui/Spinner'

const formSchema = z.object({
    email: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    password: z.string().min(10, {
        message: "Password must be at least 10 characters.",
    }),
})
interface ILoginProps {
    children?: React.ReactNode | React.ReactNode[];
}
export function Login({ }: ILoginProps) {
    // ...
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const loginMutation = trpc.auth.login.useMutation({
        onSuccess: () => {
            queryClient.invalidateQueries(getQueryKey(trpc.auth.getSession));
            navigate('/')
        },
        onError: () => {
        }
    });


    const { mutateAsync: login, data, isLoading } = loginMutation;

    console.log(data);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
        login(values)

    }

    return (
        <div className=' w-full  flex items-center justify-center p-2 md:p-6'>
            <div className='w-[400px] mt-20 shadow-md p-6'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Username" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is your public display name.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                                
                            render={({ field }) => (
                                <FormItem className='space-y-0'>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type='password' placeholder="Password" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is your public display name.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">
                            Login <Spinner isSpinning={isLoading} className='w-4 h-4 ml-2'/>
                        </Button>
                        <Link to='/auth/register' className=' ml-4 text-sm text-gray-500 hover:text-gray-700'>Don't have an account? Register</Link>
                    </form>
                </Form>
            </div>

        </div>

    )
}

