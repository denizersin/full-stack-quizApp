import React from 'react'
import { Outlet, Route, Routes, useNavigate } from 'react-router-dom';
import AuthLayer from './AuthLayer';
import MaxWidthWrapper from '@/components/ui/MaxWidthWrapper';
import NavBar from '@/components/NavBar';
import SideBar from '@/components/SideBar/SideBar';
import TopBar from '@/components/TopBar';
import { Card } from '@/components/ui/card';
import { Toaster } from "@/components/ui/toaster"


interface IRootLayOutProps {
    children?: React.ReactNode | React.ReactNode[];
}

const RootLayOut = ({ }: IRootLayOutProps) => {

    console.log('root');

    return (
        <AuthLayer>
            <div className='flex h-screen overflow-hidden max-h-screen p-2 max-w-full '>
                {/* for mobile  */}
                {/* <NavBar/> */}
                <SideBar />
                <Card className='w-full max-h-full  px-4 ml-1 shadow-none dark:shadow-lg shadow-white dark:border-slate-600'>
                    <TopBar />
                    <div className='overflow-y-scroll max-h-full pb-10 mt-2 px-1'>
                        <Outlet />
                    </div>
                </Card>

                <Toaster />

            </div>
        </AuthLayer>

    )
}
export default RootLayOut;