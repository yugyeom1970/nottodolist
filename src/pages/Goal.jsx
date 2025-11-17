import { useEffect, useState, useRef } from 'react';
import { addData, fetchData } from '../items/HandleData';
import { InputEl } from '../items/stepInput';

export default function Goal() {
    const [goals, setGoal] = useState([]);
    const [steps, setStep] = useState([]);
    // const [isSelected, setSelected] = useState(null);
    // const [wish, setWish] = useState('');
    useEffect(() => {
        fetchData('http://localhost:3003/bigGoals', setGoal)
        fetchData('http://localhost:3003/steps',setStep)
    },[])
    
    
    return (
        <ul className='w-[90%]'>
            {goals.map((goal) =>
                <BigGoalEl
                    key={goal.id}
                    goal={goal}
                    setGoal={setGoal}
                    steps={steps.filter(s => s.parentId === goal.id)}
                    setStep={setStep} />)}
        </ul>
    )
}

function BigGoalEl({goal,setGoal,steps,setStep}) {
    const [completed, setCompleted] = useState(false);
    const [newSteps, setNewStep] = useState([]);
    const goalInputRef = useRef(null);

    const addNewStepInput = () => {
        setNewStep(prev => [...prev, {content:''}])
    }

        return (
            <div className='flex flex-col w-[80%] mx-auto gap-5'>
                
            <input
                ref={goalInputRef}
                className='border 1px min-w-[300px] pl-2'
                maxLength={20} />
            <button onClick={() => addData(
                goalInputRef,
                'http://localhost:3003/bigGoals',
                setGoal
            )}>추가</button>
            <div className={`flex gap-2.5 items-center ${completed ? 'line-through' : ''}`}>
            <Toggle
            completed={completed}
            onToggle={() => setCompleted(!completed)}/>
                <span>{goal.content}</span>
                </div>
                {/* 새로 만든 InputEl(아직 db에 없음) */}
                {newSteps.map(step => (
                    <InputEl
                        key={step.id}
                        step={step}
                        setStep={setNewStep}
                        parentId={goal.id}
                        isNew={true} />
                ))}
                {/* db에서 가져온 하위목표 */}
                {steps.map(step => (
                    <InputEl
                        key={step.id}
                        step={step}
                        setStep={setStep}
                        parentId={goal.id} />
                ))}
                <button 
                    onClick={addNewStepInput}
                    className='text-sm mt-2 px-3 py-1 border rounded'
                >+하위 목표 추가</button>
        </div>
    )
}
