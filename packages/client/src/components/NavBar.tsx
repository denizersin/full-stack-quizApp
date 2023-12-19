import React from 'react'
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { trpc } from '@/lib/trpc';
import { useQueryClient } from '@tanstack/react-query';
import { getQueryKey } from '@trpc/react-query';
import useUser from '@/Hooks/useAuth';

interface INavBarProps {
    children?: React.ReactNode | React.ReactNode[];
}

const NavBar = ({ }: INavBarProps) => {

    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const logOutMutation = trpc.auth.logOut.useMutation({
        onSuccess: () => {

            queryClient.invalidateQueries(getQueryKey(trpc.auth.getSession));
        }
    });

    const { mutateAsync: logOut } = logOutMutation;

    const user = useUser()


    return (
        <div about='component' className=' bg-foreground' >
            <Button
                onClick={() => {
                    logOut({})
                }}
            >Log Out</Button>
            <Button
                onClick={() => {
                    navigate('/auth')
                }}
            >Log In</Button>
            <div className='text-primary-foreground'>asdasd</div>
        </div>
    )
}
export default NavBar;