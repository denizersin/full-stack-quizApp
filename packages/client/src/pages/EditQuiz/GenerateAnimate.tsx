import React, { useEffect, useState } from 'react'

interface IGenerateAnimateProps {
    children?: React.ReactNode | React.ReactNode[];
    key: number,
    animateInitial: boolean,
    text: string
}


const WORD_DURATION = 20;

const GenerateAnimate = ({
    key,
    animateInitial,
    text
}: IGenerateAnimateProps) => {

    const [isAnimating, setIsAnimating] = useState(animateInitial)

    const [currText, setCurrText] = React.useState('')

    const firstRender = React.useRef<HTMLSpanElement | true>(true)
    const isFirstRender = firstRender.current === true



    useEffect(() => {
        if (isFirstRender) return
        setIsAnimating(true)

    }, [key])

    useEffect(() => {

        if (isAnimating) {
            let i = 0;
            const interval = setInterval(() => {
                setCurrText(text.slice(0, i))
                i++;
                if (i > text.length) {
                    clearInterval(interval)
                    setIsAnimating(false)
                }
            }, WORD_DURATION)
        }



    }, [isAnimating])


    return (
        //@ts-ignore
        <span ref={firstRender}>
            {currText}
        </span>
    )
}
export default GenerateAnimate;