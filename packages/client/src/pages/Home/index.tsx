import { Button, buttonVariants } from '@/components/ui/button';
import React from 'react'
import { Link, useNavigate } from 'react-router-dom';

interface IHomeProps {
    children?: React.ReactNode | React.ReactNode[];
}

const Home = ({ }: IHomeProps) => {



    return (
        <div about='component' className='' >

            <div>
                <Link to={'/create-quiz'}
                    className={buttonVariants()}
                >Create Quiz</Link>
            </div>
        </div>
    )
}
export default Home;