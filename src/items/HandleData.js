
export const deleteData = async (url, id, setData) => {
    const res = await fetch(`${url}/${id}`, {
        method: 'DELETE'
    })
    if (res.ok) {
        setData((prev) => prev.filter(
            el => el.id !== res.id
        ))
    } else { throw new Error('삭제 실패') }
};

export const fetchData = async (url,setData) => {
    try {
        const res = await fetch(url);
        if(!res.ok) throw new Error('서버 응답 오류')
        const data = await res.json();
        if (!data || data.length === 0) {
            console.log(`${url}: 데이터 없음`)
            return;
        }
        setData(data);
    } catch (err) {
        console.log('데이터 불러오기 실패:', err)
    }
    
}

export const addData = (value, url, setData, extraData = {}) => {
        const newData = {
            content: value,
            isComplete: false,
            isSelect: false,
            ...extraData
        }
        fetch(url, {
            method: 'PATCH',
            body: JSON.stringify(newData)
        })
            .then((res) => res.json())
            .then((res) => setData((prev) => [...prev, res]
            ))
    setData('')

    }