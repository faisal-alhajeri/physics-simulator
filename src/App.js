import { useEffect, useRef, useState } from 'react';
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

export const FRAMES = 1000/144

export const START_STATE = {
  w: 50,
  h: 50,
  x:{
    d: 0,
    v: 0,
    a: 0
  },
  y:{
    d: 0,
    v: 0,
    a: 0
  }, 
  state: PROGRAM_STATES.RESET
}

function App() {
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

  const measuresFromRef = useRef();
  const [ball, setBall] = useState(START_STATE)
  const [measures, setMeasures] = useState({v:0, a:0, angle:0})
  const [barrierList, setBarrierList] = useState(() => {
    let b = simpleBarrier()
    b.x = 400
    b.y = 250
    return [b]
  })


  
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

  let toggleBarrierSelection = () => {
    let newSelected = barrierList.length > 0? !barrierList[0].selected : false;
    setBarrierList((oldList) => {
      return [...oldList].map(barrier => {
        barrier.selected = newSelected
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



  let changeMeasures = (form) => {
    let v = form['speed'].value
    let a = form['acceleration'].value
    let angle = form['angle'].value/180 * Math.PI

    setMeasures((oldM) => {
      return {
        v: v,
        a: a,
        angle: angle,
      }
    })
    setBall(oldBall => {
      return {
        ...oldBall,
        x: {
          ...(oldBall.x),
          v: v * Math.cos(angle)
        },
        y: {
          ...(oldBall.y),
          v: v * Math.sin(angle),
          a: a
        }
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
    })
    changeMeasures(measuresFromRef.current)
  }

  // check collision for every ball position change
  useEffect(() => {
    barrierList.forEach(barrier => {
      let newX, newVX, collision=false;

      const barrierTop = barrier.y + barrier.h,
            barrierBot = barrier.y,
            ballTop = ball.y.d + ball.h,
            ballBot = ball.y.d

      
      // collision condition on y
      if (!(ballBot > barrierTop || ballTop < barrierBot)){

      // collision condition on x, right to the ball, left to the barrier
        if(ball.x.d < barrier.x && ball.x.d + ball.w > barrier.x){
          newX = barrier.x - ball.h -1
          newVX = -ball.x.v
          collision = true
          console.log(`ball ${ballTop} ${ballBot}`);
          console.log(`barrier ${barrierTop} ${barrierBot}`);
        }

        // collision condition on x, left to the ball, right to the barrier
        else if (ball.x.d > barrier.x && barrier.x + barrier.w > ball.x.d){
          newX = barrier.x + barrier.w + 1
          newVX = -ball.x.v
          collision=true
        }
      }

      if(collision){
        // console.log(`x before collision ${ball.x.d}`);
        // console.log(`x after collision ${newX}`);

        setBall(oldBall => {
          return {
            ...oldBall,
            x: {
              ...(oldBall.x),
              d: newX,
              v: newVX
            },
          }
        })
      }
    })
  }, [ball])

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
            <form onSubmit={(e) => {
              e.preventDefault()
              changeMeasures(e.target)
              }} ref={measuresFromRef} >
            
            <div>
              <div htmlFor='speed'>speed</div>
              <div>
              <input type="number" name='speed' /> px/s

              </div>
            </div>

            <div>
              <div htmlFor='acceleration'>acceleration</div>
              <div>
              <input type="number" name='acceleration' /> px/s^2
              </div>
            </div>

            <div>
              <div htmlFor='angle'>angle</div>
              <div>
              <input type="number" name='angle' /> deg
              </div>
            </div>

            <div className='button-container'>
              <input type='submit' disabled={ball.state !== PROGRAM_STATES.RESET} value="Save" />
              <button type='button' onClick={toggleState} >
                Move/Stop
              </button>
              <button type='button' onClick={reset}>
                Reset
              </button>
            </div>

            </form>

          </div>
          <div className='inputs-container'>
            <button type='button' onClick={addBarrier}>
              Add Barrier
            </button>

            <button type='button' onClick={toggleBarrierSelection}>
              Select/Deselect All
            </button>

            <button type='button' onClick={removeSelected}>
              Remove Selected Barriers 
            </button>
          </div>

          <div className='inputs-container'>
            
          </div>
        </div>


        
      </div>
    </>

  
  );
}

export default App;
