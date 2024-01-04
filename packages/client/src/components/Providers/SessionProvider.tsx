import { trpc } from '@/lib/trpc';
import React from 'react'
import { User } from "@prisma/client"
interface ISessionProviderProps {
    children?: React.ReactNode | React.ReactNode[];
}
type U = {
    createdAt: string;
    updatedAt: string;
    id: string;
    email: string;
    name: string;
    surname: string;
    birthDate: string;
    identityNo: string;
}
export const SessionContext = React.createContext<{
    isLoading: boolean;
    isFetching: boolean;
    user: U | undefined | null
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