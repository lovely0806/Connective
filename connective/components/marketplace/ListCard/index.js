import ButtonDark from "../../button-dark"
import {useRouter} from "next/router"

const ListCard = ({item, preview}) => {
    const router = useRouter()

    return (
        <div className="bg-white flex flex-col gap-5 p-5 rounded-xl shadow-lg h-fit">
            <img className="rounded-xl object-cover h-[40%]" src={!item.cover_url || item.cover_url == "" ? "/assets/banners/leaves-min.jpeg" : item.cover_url}/>
            <p className="font-bold text-xl">{item.title}</p>
            <p className="text-[#8A8888]">{item.description}</p>
            <div className="flex flex-row gap-10 mx-auto">
                {!preview && (
                    <div className="bg-[#CCE0FE] text-black/70 font-bold text-sm p-[0.2vw] px-[0.1vw] rounded-full w-32 text-center">
                        {item.buyers} buyers
                    </div>
                )}
                
                <div className="bg-[#D3EBD5] text-black/70 font-bold text-sm p-[0.2vw] px-[0.1vw] rounded-full w-32 text-center">
                    ${item.price}
                </div>
            </div>
            {!preview && (
                <div className="mx-auto mt-10 pl-10">
                    <ButtonDark onClick={()=>{router.push(`/app/marketplace/list-details/${item.id}`)}} text="Explore" className="ml-0 mr-0 mb-0 mt-0"></ButtonDark>
                </div>
            )}
        </div>
    )
}

export default ListCard