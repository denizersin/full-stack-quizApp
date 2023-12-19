import useUser from '@/Hooks/useAuth';
import React from 'react'
import { Navigate, Outlet, useNavigate } from 'react-router-dom';

interface IAuthLayOutProps {
    children?: React.ReactNode | React.ReactNode[];
}

const AuthLayOut = ({ }: IAuthLayOutProps) => {

    const navigate = useNavigate();

    const user = useUser();



    return (

        <>
            {
                !user ?
                    <div about='component' className='' >
                        AuthLayOut
                        <Outlet />
                    </div> :
                    <Navigate to="/" replace={true} />
            }
        </>

    )
}
export default AuthLayOut;