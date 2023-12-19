import { trpc } from '@/lib/trpc';
import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom';

interface IPostsProps {
    children?: React.ReactNode | React.ReactNode[];
}

const Posts = ({ }: IPostsProps) => {

    const mutation = trpc.todo.sayHello.useMutation()
    const handleClicl = () => {
        mutation.mutate({
            input: 'sd'
        })
    }

    useEffect(() => {
    }, [])


    return (
        <div about='component' className='' >
            Posts...
            <div>
                Outlet is bottom
            </div>
            <button onClick={handleClicl}>click</button>
            <hr />
            <Outlet />
        </div>
    )
}
export default Posts;