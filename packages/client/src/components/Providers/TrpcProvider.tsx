import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TRPCClientError, TRPCClientErrorBase, httpBatchLink } from '@trpc/client'
import React, { useState } from 'react'
import { trpc } from '@/lib/trpc'
import { useNavigate } from 'react-router-dom'
interface ITrpcProvider {
    children?: React.ReactNode | React.ReactNode[];

}

function TrpcProvider
    ({ children }: ITrpcProvider) {

    const navigation = useNavigate();

    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            mutations: {
                onError: (error: any) => {
                    if (error?.data?.httpStatus === 401) {
                        navigation('/auth')
                    }
                },
            },
            queries: {
                onError: (error: any) => {
                    if (error?.data?.httpStatus === 401) {
                        navigation('/auth')
                    }
                },
            }
        }
    }))

    const [trpcClient] = useState(() => {
        return trpc.createClient({
            links: [
                httpBatchLink({
                    url: 'http://localhost:3000/trpc',
                    fetch(url, options) {
                        return fetch(url, {
                            ...options,
                            credentials: 'include',
                        });
                    },
                }),
            ],

        })
    })

    return (
        <trpc.Provider queryClient={queryClient} client={trpcClient}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </trpc.Provider>

    )
}

export default TrpcProvider

