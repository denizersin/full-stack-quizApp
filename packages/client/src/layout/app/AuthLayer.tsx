import useUser, { useSession } from '@/Hooks/useAuth';
import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom';

interface IAuthLayerProps {
    children?: React.ReactNode | React.ReactNode[];
}

const AuthLayer = ({ children }: IAuthLayerProps) => {

    const navigate = useNavigate();
    const session=useSession();
    const user = useUser();
    if(session?.isLoading){
        return <div>Loading...</div>
    
    }
    return (
        <>
            {
                user ?
                    children :
                    <Navigate to="/auth" replace={true} />
            }
        </>

    )


}
export default AuthLayer;