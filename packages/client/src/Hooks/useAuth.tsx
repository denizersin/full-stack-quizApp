import { SessionContext } from "@/components/Providers/SessionProvider"
import { trpc } from "@/lib/trpc"
import { useQueryClient } from "@tanstack/react-query"
import { getQueryKey } from "@trpc/react-query"
import { useContext } from "react"
import { useNavigate } from "react-router-dom"

export default function useUser(): any | null {
    const context = useContext(SessionContext)
    return context?.user ?? null
}

export function useSession() {
    const context = useContext(SessionContext)
    return context
}

export function useLogOutMutation() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    
    const logOutMutation = trpc.auth.logOut.useMutation({
        onSuccess: () => {

            queryClient.invalidateQueries(getQueryKey(trpc.auth.getSession));
        }
    });

    const { mutateAsync: logOut } = logOutMutation;;
    return logOutMutation

}