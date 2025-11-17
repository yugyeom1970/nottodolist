import { useRef, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import '../App.css'
import Toggle from '../items/Toggle';
    const today = new Date().toISOString().slice(0,10);

// 외부에서 data 가져오기
const useFetch = (url) => {
  const [isLoading, setIsLoading] = useState(true)
  const [advice, setAdvice] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem(`advice-${today}`);

    // 로컬스토리지 전체 검사
    Object.keys(localStorage).forEach(key => {
    if (key.startsWith('advice-') && key !== `advice-${today}`) {
      localStorage.removeItem(key); // 오늘 날짜가 아닌 건 삭제
    }
  });

    if (saved) {
      setAdvice(JSON.parse(saved))
      setIsLoading(false)
    } else {
      fetch(url)
        .then(res => res.json())
        .then(res => {
            setAdvice(res)
          setIsLoading(false)
          localStorage.setItem(`advice-${today}`,JSON.stringify(res))
            })
    }
  }, [url]);
 
  return [isLoading, advice]
}

  function TodoListEl() {
  const { date } = useParams(); // URL에서 :date 파라미터 가져오기
    const formattedDate = date ? date.replace(/-/g, '.') : '';
    const navigate = useNavigate();
    const [todos, setTodo] = useState([]);
    const [currentTodo, setCurrentTodo] = useState(null)
    const [time, setTime] = useState(0)
    const [isTimer, setIsTimer] = useState(false)

    useEffect(() => {
    // JSON 서버에서 해당 날짜 todos 가져오기
    fetch(`http://localhost:3000/todos`)
      .then(res => res.json())

      .then(filteredTodos => setTodo(filteredTodos))
      
      .catch(err => console.error(err));
      
    }, []);
    console.log(todos);

    // useEffect(() => {
    // if (currentTodo) {
    //     fetch(`http://localhost:3000/todos/${currentTodo}`, {
    //     method: 'PATCH',
    //     body: JSON.stringify({
    //     time: todos.find((el) => el.id === currentTodo)
    //             .time + 1
    //     })
    // })
    //       .then(res => res.json())
    //       .then(res => {
    //             return setTodo(prev => prev.map(
    //               todo => todo.id === currentTodo ? res : todo
    //         ))
    //       });
    //     }
    // }, [time])
    // console.log(currentTodo);

    return (
      <div className='flex flex-col min-h-screen justify-start items-center p-4 gap-6.5'>
        <div className='flex w-full justify-end'>
          {date === today && (
              <button onClick={() => navigate(`/diary/${date}`)}>일기</button>
          )}
          
        </div>
        
        <div className='clock'>{formattedDate}</div> 
        <Advice /> 
        <div className='flex justify-between w-[80%]'> 
        {isTimer ? <Timer time={time} setTime={setTime} /> :
            <StopWatch time={time} setTime={setTime} />}
          <button onClick={() => {
        setIsTimer(prev => !prev)
        setTime(0) //
        }}>{isTimer ? '스톱워치로 변경' : '타이머로 변경'}
        </button>
        </div>
          <TodoInput setTodo={setTodo} date={date} />
          <TodoList todos={todos} setTodo={setTodo}
          setCurrentTodo={setCurrentTodo} currentTodo={currentTodo} date={date} />
          
        </div>
    )
}

// inputRef - DOM 요소를 참조함
// input 태그의 value속성을 의미
// todo를 추가하는 부분
const TodoInput = ({setTodo, date}) => {
  const inputRef = useRef(null) // 공간

    const addTodo = () => {
      const inputValue = inputRef.current.value.trim();
      // 내용이 없으면 경고창 뛰우고 함수 종료
      if (!inputValue) {
        alert('할 일을 입력해주세요');
        inputRef.current.focus();
        return;
      }
        const newTodo = {
        date: date,
        content: inputRef.current.value,  // <= 이 부분 //
        time: 0,
        currentTodo: false
      }
    // JSON 서버는 데이터를 보내면 id를 자동으로 만들어줌
    fetch('http://localhost:3000/todos', {
        method: 'POST',
        body: JSON.stringify(newTodo)
    })
      .then((res) => res.json())
      .then((res) => setTodo((prev) => [...prev, res]
      ))
      inputRef.current.value = ''
      
    }

    return (
    <div className='flex justify-between w-[80%]'>
        <input
          ref={inputRef}
          className='border 1px min-w-[300px] pl-2'
          maxLength={50}/>
        <button onClick={addTodo} className='max-w-[600px] max-h-10'>추가</button>
    </div>
    )
}

// todo를 표시하는 부분
const TodoList = ({ todos, setTodo, currentTodo, setCurrentTodo, date }) => {
     // 날짜 필터링
  // const filteredTodos = date ? todos.filter(todo => todo.date === date) : todos;
  console.log(Array.isArray(todos.todos));
    
  //   useEffect(() => {
  //   // JSON 서버에서 해당 날짜 todos 가져오기
  //   fetch(`http://localhost:3000/todos`)
  //     .then(res => res.json())

  //     .then(filteredTodos => setTodo(filteredTodos))
      
  //     .catch(err => console.error(err));
      
  // },[]);
  
    return (
    <>
        <ul className='w-[90%]'>
            {todos.map((todo) => <Todo key={todo.id} todo={todo} setTodo={setTodo}
            setCurrentTodo={setCurrentTodo} currentTodo={currentTodo} />)}
        </ul>
    </>
  )
}

// todo하나
const Todo = ({ todo, setTodo, currentTodo, setCurrentTodo }) => {
  const [completed, setCompleted] = useState(false);
    return (
      <li className={`
        flex ${todo.content.length > 20 ? 'flex-col':'flex-row'} justify-between 
        ${currentTodo === todo.id ? 'current' : ''}`}>
        <section className='flex justify-start gap-3.5'>
          <div className={`flex gap-2.5 items-center ${completed ? 'line-through' : ''}`}>
            <Toggle
            completed={completed}
            onToggle={() => setCompleted(!completed)}/>
            <span>{todo.content}</span>
        </div>
        </section>
        <div className={`flex gap-3.5 items-center`}>
            {!completed && (
              formatTime(todo.time)
            )}
            <button onClick={() => {
                setCurrentTodo(todo.id)
            }}>시작하기</button>
            <button onClick={() => {
            fetch(`http://localhost:3000/todos/${todo.id}`, {
            method: 'DELETE'
            })
            .then((res) => {if (res.ok) {
              setTodo((prev) => prev.filter(
                el => el.id !== todo.id
              ))
                }}
              )
            }}>삭제</button>
        </div>
    </li>
    )
}

// 명언 가져오기
const Advice = () => {
    const [isLoading, advice] = useFetch('https://korean-advice-open-api.vercel.app/api/advice')

    return (
    <>
    {!isLoading && (
        <>
            <div className='advice'>{advice.message}</div>
            <div className='advice'>-{advice.author}-</div>
        </>
        )}
    </>
    )
}
// 시계
const Clock = () => {
    const [time, setTime] = useState(new Date())
  // useEffect를 언제 쓸까?
  // 단순히 UI렌더링만 하는 게 아니라, 렌더링 이후나 특정 상태 변화시점에 어떤 '작업'을 하고
  // 싶을 떄 사용한다
    useEffect(() => {
    setInterval(() => {
        setTime(new Date())
        },1000)
    },[])

    return <div className='clock'>{time.toLocaleDateString()}</div>
}

// formatTime 함수
const formatTime = (seconds) => {
  const timeString = `${String(Math.floor(seconds / 3600)).padStart(2,'0')}:
  ${String(Math.floor((seconds % 3600) / 60)).padStart(2,'0')}:${String(seconds % 60).padStart(2,'0')}`
  
  return timeString;
}
// timerRef - 숫자(interval ID)를 참조함
// 이건 DOM이 아니라 그냥 숫자이기 때문에 .value속성이 없다

// 0부터 시작해서 시간 세기
const StopWatch = ({time, setTime}) => {
  const [isOn, setIsOn] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
      if (isOn) {
        const timerId = setInterval(() => {
          setTime(prev => prev + 1)
        }, 1000);
        // timerRef.current는 컴포넌트가 재렌더링돼도 유지되는 변수 공간
        timerRef.current = timerId   
      } else {
        clearInterval(timerRef.current);   // <= 이 부분 //
      }
  },[isOn])

  return (
    <div>
      {formatTime(time)}
      <button onClick={() => setIsOn(prev => !prev)}>
        {isOn ? '멈춤' : '시작'}
      </button>
      <button onClick={() => {
        setTime(0);
        setIsOn(false);
      }}>리셋</button>
    </div>
  )
}

// 타이머
const Timer = ({time, setTime}) => {
  const [startTime, setStartTime] = useState(0)
  const [isOn, setIsOn] = useState(false)
  const timerRef = useRef(null)
  const audioRef = useRef(null)

  useEffect(() => {
    // 실행 전에 항상 기존 타이머 제거
    clearInterval(timerRef.current);
    if (isOn && time > 0) {
      const timerId = setInterval(() => {
        setTime(prev => prev - 1)
      }, 1000)
      timerRef.current = timerId
    } else if (time === 0 && isOn) {
      setIsOn(false);
      clearInterval(timerRef.current)
      if (audioRef.current) {
        audioRef.current.src = "/sound/alarm.mp3";
        audioRef.current.load();
        audioRef.current.currentTime = 0; // 처음부터 재생
        audioRef.current.play().catch((err) => console.warn(err));
      }
    } else if (!isOn) {
        clearInterval(timerRef.current)
    }
      return () => clearInterval(timerRef.current)
  },[isOn, time]);
  // time이 변하는 것도 지켜보고 있어야 함
  // isOn이나 time이 변할 때마다 새 타이머가 생성
  // isOn이 false가 되거나 time이 0이 되면 clearInterval로 타이머 하나가 제거가 되지만
  // time은 1초마다 계속 타이머를 생성
  // useEffect의 cleanup함수는 time의 타이머를 치움
  return (
    <div>
      <div>
        {time ? formatTime(time) : formatTime(startTime)}
        <button onClick={() => {
          setIsOn(prev => !prev)
          setTime(time ? time : startTime)
          }
        }>{isOn ? '멈춤' : '시작'}</button>
        <button onClick={() => {
          setIsOn(false)
          setTime(0)
          setStartTime(0)
        }
        } >리셋</button> 
        
      </div>
      <input
        type='range'
        // value={startTime}
        value={isOn ? time : startTime}
        min='0'
        max='3600'
        step='30'
        onChange={(event) => {
        setStartTime(event.target.value)
        }} />
      <audio
        ref={audioRef}
        src="/sound/alarm.mp3"
        preload="auto"
        onError={(e) => console.warn('오디오 로드 실패',e)} />
    </div>
  )
}

export default TodoListEl