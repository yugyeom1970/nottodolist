import './App.css'
import { useState } from 'react'
import  Calendar  from './items/Calendar'
import  TodoListEl from './pages/TodoList'
import Diary from './pages/Diary'
import Goal from './pages/Goal'
import { Routes, Route, Link} from 'react-router-dom'

function App() {
  const [currentDate, setCurrentDate] = useState(new Date())//오늘 날짜 저장

  return (
    <>
      <h1 className='text-[40px] text-center'>NOTTODOLIST</h1>
      <nav className='flex gap-2.5'>
        <Link to={'/'}>메인</Link>
        <Link to={'/goal'}>기억해두기</Link>
      </nav>
      <Routes>
        <Route path={'/'} element={<Calendar currentDate={currentDate} setCurrentDate={setCurrentDate} />} />
        <Route path={'/todo/:date'} element={<TodoListEl/>} />
        <Route path={'/diary/:date'} element={<Diary />} />
        <Route path={'/goal'} element={<Goal />} />
      </Routes>
    </>
  )
}

export default App
