import React from 'react'
import { Link } from 'react-router-dom';

interface IPostListProps {
    children?: React.ReactNode | React.ReactNode[];
}

const PostList = ({ }: IPostListProps) => {
    return (
        <div about='component' className='' >
            PostList .... Posts-{'>'}PostList (index)
            <div >
                {
                    new Array(3).fill(0).map((_, index) => (
                        <div>
                            <Link to={`/posts/${index}`}>
                                Post {index}
                            </Link>
                        </div>
                    )
                    )
                }
            </div>
        </div>

    )
}
export default PostList;