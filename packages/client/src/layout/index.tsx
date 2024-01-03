import React from 'react'
import { Link, Route, Router, Routes, useLocation, useParams } from 'react-router-dom';
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
import QuizSet from '@/pages/QuizSet';
import Quiz from '@/pages/Quiz'
import EditQuiz from '@/pages/EditQuiz';
import Search from '@/pages/Search';
interface IindexProps {
    children?: React.ReactNode | React.ReactNode[];
}

const index = ({ }: IindexProps) => {



    return (
        <Routes>

            <Route path="/" element={<RootLayOut />} >
                <Route index element={<Home />} />
                <Route path='about' element={<div>about</div>} />
                <Route path='search' element={<Search/>} />

                <Route path='create-quiz' element={<CreateQuiz />} />
                <Route path='quiz-set/:id' element={<QuizSet />} />
                <Route path='quiz/edit/:id' element={<EditQuiz />} />

                {/* <Route path='quiz/:id'  element={<Quiz />} /> */}

                //!this is not true
                <Route path='quiz/:id' Component={(props) => {
                    const {state}=useLocation();
                    return <Quiz key={state?.remount?Math.random(): 'quiz'} />
                }} />

                <Route path="posts" element={<Posts />}>
                    <Route index element={<PostList />} />
                    <Route path=":slug" element={<Post />} />
                </Route>
            </Route>

            <Route path="/auth" element={<AuthLayOut />} >
                <Route index element={<Login />} />
                <Route path='register' element={<Register />} />
            </Route>
            <Route path="*" element={<NoMatch />} />
        </Routes>
    )
}
export default index;