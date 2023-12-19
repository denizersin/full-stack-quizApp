import React from 'react'
import { useParams } from 'react-router-dom';

interface IPostProps {
    children?: React.ReactNode | React.ReactNode[];
}

const Post = ({ }: IPostProps) => {
    const { slug } = useParams();
    return (
        <div about='component' className='' >
            <div>Post-{'>'}PostId(Spesific {'<Post>'})</div>
            Post [{slug}]
        </div>
    )
}
export default Post;