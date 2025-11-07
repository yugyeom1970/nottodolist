import './App.css'
import Layout from './items/Layout'
import { Main } from './pages/Main'
import { Calendar } from 'lucide-react'
import { TodoListEl } from './pages/TodoList'
// import {Diary} from './pages/Diary'
import { Routes, Route, Link} from 'react-router-dom'

function App() {

  return (
    <>
      <h1 className='text-[40px] text-center'>NOTTODOLLIST</h1>
      <nav>
        <Link to={'/'}>메인</Link>
        {/* <Link to={'/diary'}>일기</Link> */}
      </nav>
      <Routes>
          <Route path={'/'} element={<Main />} />
          <Route path={`/todo/:date`} element={<TodoListEl />} />
          {/* <Route path={'/diary'} element={<Diary/>} /> */}
      </Routes>
    </>
  )
}

export default App
