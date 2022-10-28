import ButtonDark from "../../button-dark"
import {useRouter} from "next/router"
import Image from "next/image"
import {useEffect, useState} from "react"

const ListCard = ({item, preview}) => {
    const router = useRouter()
    const [truncatedTitle, setTruncatedTitle] = useState("")
    const [truncatedDesc, setTruncatedDesc] = useState("")

    console.log(item)

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
            <div className="rounded-xl object-cover h-48 relative overflow-hidden">
                <Image
                    layout='fill'
                    objectFit="cover"
                    src={!item.cover_url || item.cover_url == "" ? "/assets/banners/leaves-min.jpeg" : item.cover_url}
                />
            </div>
            <p className="font-bold text-lg w-full h-10 mb-5">{truncatedTitle}</p>
            <p className="text-[#8A8888] text-sm overflow-clip h-36">{truncatedDesc}</p>

            <div className="flex flex-row justify-between">
                <div className="flex flex-row gap-2">
                    <img src={item?.logo} className="rounded-full w-10 h-10 object-cover"/>
                    <p className="my-auto text-black/50 text-sm">{item?.username}</p>
                </div>
                <div className="flex flex-col text-sm font-bold">
                    <p>${parseInt(item.price).toFixed(2)}</p>
                    <p>0 buyers</p>
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