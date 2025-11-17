
import { useNavigate } from "react-router-dom"
import { ChevronLeft, ChevronRight } from "lucide-react"
// 캘린더는 날짜 선택

export default function Calendar({ currentDate, setCurrentDate }) {
    const navigate = useNavigate()
    // const [touchStart, setTouchStart] = useState(0)// 터치 시작 x좌표
    // const [touchEnd, setTouchEnd] = useState(0)// 터치 끝 x좌표
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    // 어떤 달 마지막 날짜
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate()
    // 어떤 달 처음 요일
    const firstDayOfMonth = new Date(year, month, 1).getDay()
    // 어따 쓰는거지?
    const monthNames = [
        '1월', '2월', '3월', '4월', '5월', '6월',
        '7월', '8월', '9월', '10월', '11월', '12월'
    ]
    const dayNames = ['일', '월', '화', '수', '목', '금', '토']
    // 이전 달로 이동
    const toPrevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1))
    }
    // 다음 달로 이동
    const toNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1))
    }
    // 일일 클릭 시 App의 currentDate 변경
    const toTodoList = (day) => {
        const newDate = new Date(year, month, day)
        setCurrentDate(newDate);
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        navigate(`/todo/${dateStr}`)
    }
    // 일일 클릭 시 투두로 이동
    // day를 어디서 받아오는거지? => 날짜채우기에서 '일'을 받아옴
    //     const toTodoList = (day) => {
    //     const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    //     navigate(`/todo/${dateStr}`)
    // }
    // 달력 날짜 그리기
    const makeCalendars = () => {
        const days = []
        // 첫 날 전 빈칸 채우기
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className="aspect-square"/>)
        }
        // 날짜 채우기
        for (let day = 1; day <= lastDayOfMonth; day++) {
            const isToday =
                day === new Date().getDate() &&
                month === new Date().getMonth() &&
                year === new Date().getFullYear()
            
            days.push(
                <button key={day} onClick={() => toTodoList(day)}
                    className={`aspect-square rounded-lg flex items-center justify-center
            transition-colors hover:bg-blue-100 hover:text-blue-700
            ${isToday ? "bg-blue-500 text-white font-bold" : ""}`}
                >{day}</button>
            )
        }
        return days
    }

    return (
        <div className="flex flex-col p-6.5 aspect-square gap-[12px]"> 
            <div className="flex flex-row items-start justify-between mb-6">
                {/* 이전 달 버튼 */}
            <button variant="outline" size="icon" onClick={toPrevMonth}>
                <ChevronLeft className='h-4 w-4'/>
            </button>
            {/* 현재 연도와 월 표시 */}
            <h2>
                {year}년 {monthNames[month]}
            </h2>
            {/* 다음 달 버튼 */}
            <button variant="outline" size="icon" onClick={toNextMonth}>
                <ChevronRight className='h-4 w-4'/>
            </button>
            </div>
            

            {/* // 요일 이름 표시(일~토) */}
            <div className="grid grid-cols-7 gap-2 mb-2">
                {dayNames.map((day, index) => (
                <div
                    key={day}
                    className={`text-center text-sm font-semibold py-2 ${
                    index === 0 ? "text-red-500" : index === 6 ? "text-blue-500" : "text-gray-600"
                }`}
                >
                    {day}
                </div>
            ))}
            </div>
            {/* 달력의 날짜 부분(1~31일 + 빈칸)*/}
            <div className="grid grid-cols-7 gap-2">
                {makeCalendars()}
            </div>
        </div>
        
    )
}
