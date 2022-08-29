import { useEffect, useState } from 'react';
import './App.css';
import Ball from './components/Ball';
import Barrier from './components/Barrier';
import {v4 as uuid} from 'uuid';


export const PROGRAM_STATES ={
  STOP: "stop",
  MOVE: "move", 
  RESET: 'reset'
}

const STEP = 9

export const FRAMES = 1000/200

const START_STATE = {x:0, y:0, state: PROGRAM_STATES.RESET}

function App() {
  const [ball, setBall] = useState(START_STATE)
  const [measures, setMeasures] = useState({v:0, a:0, angle:0})
  const [barrierList, setBarrierList] = useState([])

  
  let setBarrier = (id, newBarrier) => {

    setBarrierList(oldList => {
      let newList = [...oldList]
      return newList.map(barrier => {
        if (id === barrier.id){
          return newBarrier
        }
        return barrier
      })
    })
  }

  let removeSelected = () => {
    setBarrierList(oldList => oldList.filter(barrier => !barrier.selected))
  }

  let moveBarriers = (e) => {
    let x = 0;
    let y = 0;
    switch (e.code) {
      case "KeyW":
        y = STEP;
        break;
      case "KeyS":
        y = -STEP;
        break;
      case "KeyD":
        x = STEP;
        break;
      case "KeyA":
        x = -STEP
        break;
      default:
        break;
    }
    setBarrierList((oldList) => {
      return oldList.map(barrier => {
        if (barrier.selected){
          barrier.x += x;
          barrier.y += y;
        }
        return barrier
      })
    })
  }

  useEffect(() => {
    document.addEventListener('keydown', moveBarriers)
  }, [])

  let simpleBarrier = () => {
    return{
      id: uuid(),
      x: 100,
      y: 100,
      h: 100,
      w: 10,
      selected : false
    }
  }

  let changeMeasures = (e) => {
    e.preventDefault()
    setMeasures((oldM) => {
      return {
        v: e.target['speed'].value,
        a: e.target['acceleration'].value,
        angle: e.target['angle'].value /180 * Math.PI,
      }
    })
  }

  let toggleState = () => {
    if (ball.state === PROGRAM_STATES.STOP || ball.state === PROGRAM_STATES.RESET){
      setBall({...ball, state: PROGRAM_STATES.MOVE})
    } else {
      setBall({...ball, state: PROGRAM_STATES.STOP})

    }
  }

  let reset = () => {
    setBall((oldBall) =>{
      return {
        ...START_STATE,
      }
    } )
  }

  let addBarrier = () => {
    setBarrierList((oldList) => {
      return [...oldList, {...simpleBarrier()}]
    })
  }

  return (
    <>
      <div className='sky'>
        {/* <Barrier barrier={}/> */}
        {barrierList.map((barrier) => {
          return <Barrier key={barrier.id} barrier={barrier} setBarrier={setBarrier} />
        })}
        <Ball ball={ball} setBall={setBall} measures={measures} />
      </div>

      
      <div className='ground'>
        <div className='outer-inputs-container'>
        <div className='inputs-container'>
          <form onSubmit={changeMeasures}>
          
          <label labelFor='speed'>speed</label>
          <input type="number" name='speed' />

          <label labelFor='acceleration'>acceleration</label>
          <input type="number" name='acceleration' />

          <label labelFor='angle'>angle</label>
          <input type="number" name='angle' />

          <input type='submit' />
          <button type='button' onClick={toggleState}>
            toggle
          </button>
          <button type='button' onClick={reset}>
            Reset
          </button>
          </form>

        </div>
        <div className='inputs-container'>
          <button type='button' onClick={addBarrier}>
            add barrier
          </button>

          <button type='button' onClick={removeSelected}>
            remove selected
          </button>
        </div>
        </div>
        
      </div>
    </>

  
  );
}

export default App;
