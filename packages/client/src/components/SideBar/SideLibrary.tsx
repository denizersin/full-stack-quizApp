import { ArrowRight, LibraryBig, Plus } from 'lucide-react';
import React, { useContext } from 'react'
import { EXPANDED_SIDEBAR_WIDTH, INITIAL_SIDEBAR_WIDTH, SideBarWidthContext } from './SideBar';
import { cn } from '@/lib/utils';
import { ScrollArea } from "@/components/ui/scroll-area"

interface ISideLibraryProps {
    children?: React.ReactNode | React.ReactNode[];
}

const SideLibrary = ({ }: ISideLibraryProps) => {

    const { width, setWidth, isExpanded } = useContext(SideBarWidthContext)

    console.log(width);

    return (
        <div about='component' className='mt-4 h-full max-h-full  flex flex-col' >

            <div className='top-head max-w-full pr-6'>

                <div className="row1  flex justify-between">
                    <div className="left title flex">
                        <LibraryBig strokeWidth={'0.8px'}/>
                        <span className='ml-2'> Your Library</span>
                    </div>
                    <div className="right flex items-center">
                        <div className="rounder p-1 rounded-full hover:bg-muted cursor-pointer">
                            <Plus className='' />
                        </div>
                        <ArrowRight
                            onClick={() => isExpanded ? setWidth(INITIAL_SIDEBAR_WIDTH) : setWidth(EXPANDED_SIDEBAR_WIDTH)}
                            className={cn('ml-2 cursor-pointer',
                                {
                                    'rotate-180': isExpanded
                                })} />
                    </div>
                </div>

                <div className="row2 category-pills flex mt-2">
                    {
                        new Array(4).fill(0).map((_, i) => (
                            <div key={i} className="p-1 px-2 rounded-full bg-secondary text-secondary-foreground  text-xs mr-2 mb-2 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700">
                                {`Category`}
                            </div>
                        ))
                    }
                </div>
            </div>


            <ScrollArea className="overflow-y-scroll h-full mr-1 ">
                <div className="h-screen">wwe</div>
                <div className="h-screen">we</div>
            </ScrollArea>
        </div>
    )
}
export default SideLibrary;