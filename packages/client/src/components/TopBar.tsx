import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Avatar from './Avatar';
import { Bell, Moon, Sun } from 'lucide-react';
import { useLogOutMutation } from '@/Hooks/useAuth';
import { Button } from './ui/button';
import { useTheme } from './Providers/ThemeProvider';
interface ITopBarProps {
    children?: React.ReactNode | React.ReactNode[];
}

const TopBar = ({ }: ITopBarProps) => {


    const { mutate: logOut, isLoading: isLogginOut } = useLogOutMutation()

    const { setTheme } = useTheme()

    return (
        <div about='component' className=' flex justify-end gap-2 mt-2' >
            <div className='py-1 px-2 -[.4px]  hover:bg-muted rounded-sm  cursor-pointer flex items-center justify-center'>
                Explore
            </div>

            <DropdownMenu>
                <DropdownMenuTrigger className='py-1 px-2  hover:bg-muted rounded-sm '>
                    <Avatar className='w-8 h-8' />
                </DropdownMenuTrigger>
                <DropdownMenuContent className='mr-4'>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Billing</DropdownMenuItem>
                    <DropdownMenuItem>Subscription</DropdownMenuItem>
                    <DropdownMenuItem className='cursor-pointer'
                        onClick={() => { logOut({}) }}
                    >Log Out</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
                <DropdownMenuTrigger className='py-1 px-2  hover:bg-muted rounded-sm '>
                    <Bell />
                </DropdownMenuTrigger>
                <DropdownMenuContent className='mr-4'>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Billing</DropdownMenuItem>
                    <DropdownMenuItem>Team</DropdownMenuItem>
                    <DropdownMenuItem>Subscription</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
                <DropdownMenuTrigger className='   '>
                    <Button variant="outline" size="icon" className='py-1 px-3 hover:bg-muted rounded-sm  border-none '>
                        <Sun className="h-[1.2rem] w-[1.2rem]  rotate-0 scale-150 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setTheme("light")}>
                        Light
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                        Dark
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")}>
                        System
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

        </div>
    )
}
export default TopBar;