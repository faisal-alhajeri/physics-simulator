import React, { useEffect, useRef } from 'react'

export default function Barrier({ barrier, setBarrier }) {
    let barrierRef = useRef();
    let classList = `barrier ${barrier.selected? 'selected-barrier': ''}`
    let copyRef = useRef(barrier)


    let styles ={
        left: `${barrier.x}px`,
        bottom: `${barrier.y}px`,
        height:  `${barrier.h}px`,
        width:  `${barrier.w}px`,
    }

    let setSelected = () => {
        let newSelected = !barrier.selected
        setBarrier(barrier.id, {...barrier, selected: newSelected})
    }

    let mouseClick = (e) => {
        let removeEvent = (e) => {
            document.onmouseup = null;
            document.onmousemove = null;
        }

        let mouseMove = (e) => {
            copyRef.current.x += e.movementX
            copyRef.current.y -= e.movementY
            console.log(copyRef.current)
            setBarrier(barrier.id, {...(copyRef.current)})
        }

        document.onmouseup = removeEvent
        document.onmousemove = mouseMove

        console.log(e);
    }

    useEffect(() => {
        copyRef.current = {...barrier}
    }, [barrier])

    useEffect(() => {
        barrierRef.current.addEventListener('mousedown', mouseClick)
    }, [])

    return (
        <div ref={barrierRef} className={classList} key={barrier.id} style={styles} onClick={setSelected} ></div>
    )
}
