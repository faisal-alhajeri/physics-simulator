import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { FRAMES, PROGRAM_STATES } from '../App'



export default function Ball({ball, setBall, measures}) {
    let start =        
    {
        x: {
            d: 0,
            v: measures.v * Math.cos(measures.angle),            
        },
        y: {
            d: 0,
            v: measures.v * Math.sin(measures.angle),            
            a: measures.a
        }
    }
    let currentMeasures = useRef(start);


    // let styles = useMemo(() => {
    //     return {
    //         left: `${ball.x}px`,
    //         bottom: `${ball.y}px`,
    //     }
    // }, [ball.x, ball.y])

    
    let styles =  {
        left: `${ball.x}px`,
        bottom: `${ball.y}px`,
    }
    

    const moveFrame = () => {
        let newX = currentMeasures.current.x.d + currentMeasures.current.x.v * FRAMES/1000
        let newY = currentMeasures.current.y.d + currentMeasures.current.y.v * FRAMES/1000
        console.log(currentMeasures.current);
        // console.log(`x: ${currentMeasures.current.x} y: ${newY}`);
        setBall(oldBall => {
            return {
                ...oldBall,
                x:newX,
                y:newY
            }
        })

        currentMeasures.current.y.v -= currentMeasures.current.y.a * FRAMES/1000

        if (newY < 0 ) setBall(oldBall => {return {...oldBall, state:PROGRAM_STATES.STOP}})
    }

    useEffect(() => {
        if(ball.state === PROGRAM_STATES.MOVE){
            let I = setInterval(moveFrame, FRAMES)
            return () => clearInterval(I)
        }
        
    }, [ball.state])

    useEffect(() => {
        currentMeasures.current.x.d = ball.x
        currentMeasures.current.y.d = ball.y
        
    }, [ball.x, ball.y])

    useEffect(() => {
        currentMeasures.current = start
    }, [measures])

    useEffect(() => {
        if(ball.state === PROGRAM_STATES.RESET){
            currentMeasures.current = start
        }
    }, [ball.state])

    // test
    useEffect(() => {
        // console.log("state changed");
        // setTimeout(() => setBall(prevBall => {
        //     return {
        //         ...Ball,
        //         state: PROGRAM_STATES.MOVE
        //     }
        // }), 2000)

        // setTimeout(() => setBall(prevBall => {
        //     return {
        //         ...prevBall,
        //         x:55
        //     }
        // }), 5000)
    }, [ball.state])

    return (
        <div className='ball' style={styles}></div>
    )
}
