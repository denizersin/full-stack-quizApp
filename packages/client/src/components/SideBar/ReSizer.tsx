import React, { useContext } from 'react'
import { MAX_SIDEBAR_WIDTH, SideBarWidthContext } from './SideBar';
import { cn } from '@/lib/utils';

interface IReSizerProps {
    children?: React.ReactNode | React.ReactNode[];
    className?: string;

}


const ReSizer = ({
    className
}: IReSizerProps) => {

    const { width, setWidth } = useContext(SideBarWidthContext)

    return (
        <div
            className={cn(className, '')}

            onMouseDown={(e) => {
                e.preventDefault();
                const startX = e.pageX;
                const startWidth = width;
                const mouseMoveHandler = (e: MouseEvent) => {
                    const newWidth = startWidth + (e.pageX - startX);
                    if (newWidth < 0) {
                        return;
                    }
                    if (newWidth > MAX_SIDEBAR_WIDTH) {
                        setWidth(MAX_SIDEBAR_WIDTH);
                        return;
                    }
                    setWidth(newWidth);
                };
                const mouseUpHandler = () => {
                    document.removeEventListener('mousemove', mouseMoveHandler);
                    document.removeEventListener('mouseup', mouseUpHandler);
                };
                document.addEventListener('mousemove', mouseMoveHandler);
                document.addEventListener('mouseup', mouseUpHandler);
            }}
        >

        </div>
    )
}
export default ReSizer;