import { trpc } from '@/lib/trpc';
import React from 'react'

interface ISessionProviderProps {
    children?: React.ReactNode | React.ReactNode[];
}

export const SessionContext = React.createContext<{
    isLoading: boolean;
    isFetching: boolean;
    user: any;
} | null>(null);

const SessionProvider = ({
    children
}: ISessionProviderProps) => {

    const sessionQuery = trpc.auth.getSession.useQuery(undefined, {
        onSuccess: (data) => {
            console.log(data);
        },

    })



    const { data, isLoading, isFetching } = sessionQuery;
    console.log('isLoading SESSION', isLoading);
    console.log('SESSION', data);

    return (
        <SessionContext.Provider value={{
            isLoading,
            isFetching,
            user: data
        }}>
            {children}
        </SessionContext.Provider>
    )
}
export default SessionProvider;