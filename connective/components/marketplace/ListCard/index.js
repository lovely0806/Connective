import ButtonDark from "../../button-dark"
import {useRouter} from "next/router"
import Image from "next/image"
import {useEffect, useState} from "react"

const ListCard = ({item, preview}) => {
    const router = useRouter()
    const [truncatedTitle, setTruncatedTitle] = useState("")
    const [truncatedDesc, setTruncatedDesc] = useState("")

    useEffect(() => {
        console.log(item)
        if(typeof(item.title) == "undefined") return
        
        let titleLen = 60
        let descLen = 180
        let isTitleLong = item.title.length > titleLen
        let isDescLong = item.description.length > descLen
        let temp = ""
        temp = item.title.slice(0,titleLen)
        if(isTitleLong) temp += "..."
        setTruncatedTitle(temp)
        temp = item.description.slice(0,descLen)
        if(isDescLong) temp += "..."
        setTruncatedDesc(temp)
    }, [item])

    return (
        <div className="bg-white flex flex-col gap-5 p-5 rounded-xl shadow-lg h-full">
            <div className="rounded-xl object-cover h-[40%] relative">
                <Image
                    layout='fill'
                    src={!item.cover_url || item.cover_url == "" ? "/assets/banners/leaves-min.jpeg" : item.cover_url}
                />
            </div>
            <p className="font-bold text-lg w-full h-10 mb-5">{truncatedTitle}</p>
            <p className="text-[#8A8888] text-sm overflow-clip">{truncatedDesc}</p>
            <div className="flex flex-row gap-10 mx-auto mt-auto">
                {!preview && (
                    <div className="bg-[#CCE0FE] text-black/70 font-bold text-sm p-[0.2vw] px-[0.05vw] rounded-full w-32 text-center">
                        {item.buyers} buyers
                    </div>
                )}
                
                <div className="bg-[#D3EBD5] text-black/70 font-bold text-sm p-[0.2vw] px-[0.05vw] rounded-full w-32 text-center">
                    ${item.price}
                </div>
            </div>
            {!preview && (
                <div className="mx-auto pl-10">
                    <ButtonDark onClick={()=>{router.push(`/app/marketplace/list-details/${item.id}`)}} text="Explore" className="ml-0 mr-0 mb-0 mt-0"></ButtonDark>
                </div>
            )}
        </div>
    )
}

export default ListCard