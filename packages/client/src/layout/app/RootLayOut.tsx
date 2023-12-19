import React from 'react'
import { Outlet, Route, Routes, useNavigate } from 'react-router-dom';
import AuthLayer from './AuthLayer';
import MaxWidthWrapper from '@/components/ui/MaxWidthWrapper';
import NavBar from '@/components/NavBar';
import SideBar from '@/components/SideBar/SideBar';
import TopBar from '@/components/TopBar';
import { Card } from '@/components/ui/card';

interface IRootLayOutProps {
    children?: React.ReactNode | React.ReactNode[];
}

const RootLayOut = ({ }: IRootLayOutProps) => {

    console.log('root');

    return (
        <AuthLayer>
            <div className='flex h-screen max-h-screen p-2 max-w-full  '>
                {/* for mobile  */}
                {/* <NavBar/> */}
                <SideBar />
                <Card className='w-full px-4 ml-1 shadow-none'>
                    <div className=''>
                        <TopBar />
                        <Outlet />
                    </div>
                </Card>

            </div>
        </AuthLayer>

    )
}
export default RootLayOut;