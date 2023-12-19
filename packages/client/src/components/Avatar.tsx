import React from 'react'
import { Avatar as AvatarComp, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface IAvatarProps {
    children?: React.ReactNode | React.ReactNode[];
    className?: string;
}

const Avatar = ({
    className,
    ...props
}: IAvatarProps) => {
    return (
        <AvatarComp className={cn(className)}>
            <AvatarImage className='max-w-full' src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
        </AvatarComp>
    )
}
export default Avatar;