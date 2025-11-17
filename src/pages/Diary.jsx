import { useState, useEffect, useRef } from "react"
import { useParams } from "react-router-dom"


export default function Diary () {
    const { date } = useParams();
    const [diary, setDiary] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
        // 삭제 함수
    const handleDelete = () => {
        if (!diary) return;
        fetch(`http://localhost:3002/diaries/${diary.id}`, {
            method: 'DELETE'
        })
        .then(() => setDiary(null))
    }

    // 페이지 로드 시 해당 날짜의 일기 불러오기
    useEffect(() => {
        fetch(`http://localhost:3002/diaries?date=${date}`)
            .then(res => res.json())
            .then(data => setDiary(data[0] || null))
            .catch(err => console.log(err))
    }, [date]);

    if (!diary || isEditing) {
        return <DiaryForm setIsEditing={setIsEditing} diary={diary} setDiary={setDiary}
            date={date} />
    }

    return (
        <div className='flex flex-col mx-auto w-[80%] gap-5'>
                <span className="inline-block border-b w-fit text-2xl p-2.5">
                    {diary?.title}
                </span>
                <span className="min-h-40 p-2.5 rounded-md">
                    {diary?.content}
                </span>
            <div className="flex gap-3 justify-end">
                <button onClick={handleDelete}>삭제하기</button>
                <button onClick={() => setIsEditing(true)}>
                    {isEditing ? '올리기' : '수정하기'}
                </button>
            </div>
        </div>
    )
}


const DiaryForm = ({ diary, setDiary, date, setIsEditing }) => {
const [title, setTitle] = useState(diary?.title || '');
const [content, setContent] = useState(diary?.content || '');
const textareaRef = useRef(null);
    
    // textarea 자동 높이 조절
    useEffect(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = 'auto';
        el.style.height = el.scrollHeight + 'px';
    },[content]);

    //diary가 바뀔 때마다 내용 초기화
    useEffect(() => {
        if (diary) {
            setTitle(diary.title || '');
            setContent(diary.content || '');
        }
    },[diary]);

    // fetchFunc가 실제 버튼 클릭 시점에 실행됨
    // 클릭 순간의 diary상태를 확인해서 url과 method를 계산
    // diary상태가 변한 시점을 기준으로 url, method를 계산 해야 함
    const fetchFunc = () => {

        const newDiary = {
        date,
        title,
        content,
        };
        // 내용이 없으면 경고창 뛰우고 함수 종료
        if (!title.trim()) {
            alert('하루를 입력해주세요')
            return;
        }
        const url = diary
        ? `http://localhost:3002/diaries/${diary.id}`
        : 'http://localhost:3002/diaries';
        const method = diary ? 'PUT' : 'POST';
        
            fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newDiary)
        })
            .then((res) => res.json())
            // saved는 db에 방금 저장된 최신 데이터 한 건
            .then(saved => {
                setDiary(saved);
                setIsEditing(false);
        })
        setTitle('');
        setContent('');
    }
        
    return (
    <div className='flex flex-col items-center gap-5'>
            <h2>{diary ? '일기 수정하기' : '새 일기 쓰기'}</h2>
            <div className='flex flex-col w-[80%] gap-5'>
                <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='오늘 한 줄 요약'
                maxLength={50}
                className="border p-2.5 rounded-md" />
                <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder='쓸 게 있다면 적어주세요'
                className="border p-2.5 rounded-md" />
                    <div className='flex justify-end'>
                        <button onClick={() => fetchFunc()}>올리기</button>
                        <button onClick={() => {
                            setTitle('');
                            setContent('');
                        }}>초기화</button>
                    </div>
            </div>
    </div>
)
    }

