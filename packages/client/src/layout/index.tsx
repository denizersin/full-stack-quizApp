import React from 'react'
import { Link, Route, Router, Routes } from 'react-router-dom';
import NoMatch from './NoMatch';
import AuthLayOut from './auth/AuthLayOut';
import RootLayOut from './app/RootLayOut';
import Posts from '@/pages/Posts';
import PostList from '@/pages/Posts/_PostList';
import Post from '@/pages/Posts/Post/Post';
import { Register } from '@/pages/Auth/Register';
import { Login } from '@/pages/Auth/Login';
import Home from '@/pages/Home';
import CreateQuiz from '@/pages/CreateQuiz';

interface IindexProps {
    children?: React.ReactNode | React.ReactNode[];
}

const index = ({ }: IindexProps) => {



    return (
        <Routes>

            <Route path="/" element={<RootLayOut />} >
                <Route index element={<Home/>} />
                <Route path='about' element={<div>about</div>} />
                <Route path='search' element={<div>search</div>} />

                <Route path='create-quiz' element={<CreateQuiz/>} />

                <Route path="posts" element={<Posts />}>
                    <Route index element={<PostList />} />
                    <Route path=":slug" element={<Post />} />
                </Route>
            </Route>

            <Route path="/auth" element={<AuthLayOut />} >
                <Route index  element={<Login/>} />
                <Route path='register' element={<Register />} />
            </Route>
            <Route path="*" element={<NoMatch />} />
        </Routes>
    )
}
export default index;