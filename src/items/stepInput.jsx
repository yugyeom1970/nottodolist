
import { useState } from 'react';
import { Toggle } from './Toggle';
import { deleteData } from './HandleData';

export function InputEl({ step, setStep, parentId, isNew }) {
    const [completed, setCompleted] = useState(false);

    // 상태 입력값 변경
    const handleChange = (id, value) => {
        setStep(prev =>
            prev.map(el =>
                el.id === id ? { ...el, content: value } : el
            )
        );
    };
    // blur 시 db 반영
    const handleBlur = async () => {
        if (!step.content.trim()) return;
        // 새 step이면 POST 필요
        if (isNew) {
            await fetch('http://localhost:3003/steps', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: step.content,
                    parentId
                })
            });
            return;
        }
        // 기존 step이면 PATCH
        await fetch(`http://localhost:3003/steps/${step.id}`, {
            method: 'PATCH',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                content: step.content,
                parentId
            })
        })
    };
    return (
        <li className='border border-b w-[80%] mx-auto gap-5'>
            <Toggle
                completed={completed}
                onToggle={() => setCompleted(prev => !prev)}
            />
            <input
                value={step.content || ''}
                onChange={(e) => handleChange(step.id, e.target.value)}
                onBlur={handleBlur}
                className="" />
            <button
                onClick={() => deleteData(
                    'http://localhost:3003/steps',
                    step.id,
                    setStep
                )}>X</button>
        </li>
    )
}
