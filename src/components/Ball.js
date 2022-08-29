import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { FRAMES, PROGRAM_STATES } from '../App'



export default function Ball({ball, setBall, measures}) {
    let currentMeasures = useRef(ball);
    let I = useRef(0)

    let styles =  {
        left: `${ball.x.d}px`,
        bottom: `${ball.y.d}px`,
        height: `${ball.h}px`,
        width: `${ball.w}px`,
    }
    

    const moveFrame = () => {
        let newX = currentMeasures.current.x.d + currentMeasures.current.x.v * FRAMES/1000
        let newY = currentMeasures.current.y.d + currentMeasures.current.y.v * FRAMES/1000
        let newVY = currentMeasures.current.y.v - currentMeasures.current.y.a * FRAMES/1000
        setBall(oldBall => {
            return {
                ...oldBall,
                x:{...(oldBall.x), d: newX},
                y:{...(oldBall.y), d: newY, v: newVY}
            }
        })


        if (newY < 0 ) setBall(oldBall => {return {...oldBall, state:PROGRAM_STATES.STOP}})
    }

    useEffect(() => {
        if(ball.state === PROGRAM_STATES.MOVE){
            I.current = setInterval(moveFrame, FRAMES)
            return () => clearInterval(I.current)
        }
        
    }, [ball.state])

    useEffect(() => {
        currentMeasures.current = {...ball}
    }, [ball])

    useEffect(() => {
        currentMeasures.current = ball
    }, [measures])




    return (
        <div className='ball' style={styles}></div>
    )
}
