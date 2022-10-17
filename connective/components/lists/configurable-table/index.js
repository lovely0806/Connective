import {useEffect} from "react"

const HeaderRow = ({col1, col2}) => {
    return (
        <div className="flex flex-row rounded-t-xl border border-black/30">
            <div className="w-full text-center rounded-tl-xl border-r border-black/30 py-2">
                <p className="font-bold">{col1}</p>
            </div>
            <div className="w-full text-center rounded-tr-xl py-2">
                <p className="font-bold">{col2}</p>
            </div>
        </div>
    )
}

const Row = ({id, data, setData}) => {
    const updateName = (e) => {
        let d = data
        d[id].name = e.target.value
        setData(d)
    }

    const updateDescription = (e) => {
        let d = data
        d[id].description = e.target.value
        setData(d)
    }

    return (
        <div className={`flex flex-row border border-black/30 h-10 ${id==data.length-1 ? "rounded-b-xl" : ""}`}>
            <div className={`w-full text-center border-r border-black/30`}>
                <input onChange={updateName} className="w-full h-full outline-none px-5 rounded-xl"></input>
            </div>
            <div className={`w-full text-center`}>
                <input onChange={updateDescription} className="w-full h-full outline-none px-5 rounded-xl"></input>
            </div>
        </div>
    )
}

const ConfigurableTable = ({data, setData, column1Name, column2Name, title}) => {
    useEffect(() => {
        console.log(data)
    }, [data])
    return (
        <div>
            <p className="text-sm mb-2">{title}</p>
            <div className="rounded-xl mb-2">
                <HeaderRow col1={column1Name} col2={column2Name}></HeaderRow>
                {data.map((item, index) => {
                    return (
                        <Row key={index} id={index} data={data} setData={setData}></Row>
                    )
                })}
            </div>
            <div className="flex flex-row gap-5">
                <button className="bg-[#0F172A] text-white rounded-full w-8 h-8 text-[20px]" onClick={()=>{setData([...data, {name: "", description: ""}])}}>+</button>
                <button className="bg-[#0F172A] text-white rounded-full w-8 h-8 text-[20px]" onClick={()=>{let d = data; d.shift(); console.log(d); setData([...d])}}>-</button>
            </div>
            
        </div>
    )
}

export default ConfigurableTable