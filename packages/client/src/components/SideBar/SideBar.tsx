import { cn } from '@/lib/utils';
import React, { useState } from 'react'
import ReSizer from './ReSizer';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Link, NavLink } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import SideLibrary from './SideLibrary';

interface ISideBarProps {
    children?: React.ReactNode | React.ReactNode[];
}


export const MAX_SIDEBAR_WIDTH = 720;

export const EXPANDED_SIDEBAR_WIDTH = 720;
export const INITIAL_SIDEBAR_WIDTH = 520;

export const SideBarWidthContext = React.createContext<{
    width: number;
    setWidth: (width: number) => void;
    isExpanded: boolean;
}>({
    width: INITIAL_SIDEBAR_WIDTH,
    setWidth: () => { },
    isExpanded: false,

});

const SideBar = ({ }: ISideBarProps) => {

    const [width, setWidth] = useState(INITIAL_SIDEBAR_WIDTH)

    return (
        <SideBarWidthContext.Provider value={{
            width,
            setWidth,
            isExpanded: width >= EXPANDED_SIDEBAR_WIDTH
        }}>

            <div about='component'
                style={{ width }}
                className={cn(`h-full  max-w-[${MAX_SIDEBAR_WIDTH}rem] relative transition-all`)} >

                <div className='sections-container h-full flex flex-col pr-2 gap-2'>
                    <Card className='w-full border-[.2px] shadow-none '>
                        <CardHeader>
                            <CardTitle className='font-normal'>
                                <NavLink to='/'
                                    className={
                                        (({ isActive, isPending }) =>
                                            cn(`flex items-center gap-4 py-2  mt-2 hover:font-semibold hover:text-black dark:hover:text-white  text-[#777777] transition-all `, {
                                                'font-semibold text-black dark:text-white  ': isActive,
                                                'bg-gray-100': isPending,

                                            }))
                                    }

                                >
                                    <Home />
                                    Home
                                </NavLink>

                                <NavLink to='/search'
                                    className={
                                        (({ isActive, isPending }) =>
                                            cn(`flex items-center gap-4 py-2  mt-2 hover:font-semibold hover:text-black dark:hover:text-white  text-[#777777] transition-all `, {
                                                'font-semibold text-black dark:text-white ': isActive,
                                                'bg-gray-100': isPending,

                                            }))
                                    }

                                >
                                    <Search />
                                    Search
                                </NavLink>


                            </CardTitle>
                        </CardHeader>

                    </Card>

                    <Card className='w-full h-full overflow-hidden shadow-none '>
                        <CardContent className='h-full pr-0'>
                            <SideLibrary />
                        </CardContent>
                    </Card>
                </div>





                <ReSizer
                    className='resizer absolute w-[.2rem] h-full left-full top-0 bg-transparent hover:bg-gray-500 cursor-move'
/>
            </div>
        </SideBarWidthContext.Provider>
    )
}
export default SideBar;