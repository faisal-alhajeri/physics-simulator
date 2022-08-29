import React, { useRef } from 'react'

export default function Barrier({ barrier, setBarrier }) {
    let barrierRef = useRef();

    let styles ={
        left: `${barrier.x}px`,
        bottom: `${barrier.y}px`,
        height:  `${barrier.h}px`,
        width:  `${barrier.w}px`,
    }

    let moveWithKeys = (e) => {
        switch (e.code) {
            case "KeyW":
                console.log("up");
                break;
            case "KeyS":
                console.log("down");
                break;
            case "KeyD":
                console.log("right");
                break;
            case "KeyA":
                console.log("left");
                break;
            default:
                break;
        }
    }

    let setSelected = () => {
        let newSelected = !barrier.selected
        setBarrier(barrier.id, {...barrier, selected: newSelected})
        // barrierRef.current.addEventListener('keydown', moveWithKeys)
    }

    let classList = `barrier ${barrier.selected? 'selected-barrier': ''}`

    return (
        <div className={classList} key={barrier.id} style={styles} onClick={setSelected} ></div>
    )
}
