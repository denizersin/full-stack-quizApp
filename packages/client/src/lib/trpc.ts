import { createTRPCReact } from '@trpc/react-query'
import { AppRouter,TUser} from 'server'

export const trpc = createTRPCReact<AppRouter>()
