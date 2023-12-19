import React from 'react'

interface INoMatchProps {
    children?: React.ReactNode | React.ReactNode[];
}

const NoMatch = ({ }: INoMatchProps) => {
    return (
        <div about='component' className='' >
            NoMatch
        </div>
    )
}
export default NoMatch;