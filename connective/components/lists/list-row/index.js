import ButtonDark from "../../button-dark"
import ButtonLight from "../../button-light"
import Image from "next/image"

const ListRow = ({item}) => {
    return (
        <div className="bg-white rounded-xl shadow-lg flex flex-row gap-5 p-5">
            <div className="rounded-xl object-cover h-48 w-80 relative overflow-hidden">
                <Image 
                    layout='fill'
                    objectFit="cover"
                    src={!item.cover_url ? "/assets/banners/leaves-min.jpeg" : item.cover_url}
                />
            </div>
            <div className="flex flex-col">
                <p className="text-xl font-bold">{item.title}</p>
                <p className="text-black/50">{item.description}</p>
                <div className="bg-[#D3EBD5] px-5 py-1 w-fit rounded-lg text-sm font-medium mt-auto">
                    <p>${item.price.toFixed(2)}</p>
                </div>
            </div>
            <div className="flex flex-col gap-5 ml-auto">
                <ButtonDark text="Edit" className="w-full mt-auto"></ButtonDark>
                <ButtonLight text="Unpublish" className="w-full mb-auto"></ButtonLight>
            </div>
        </div>
    )
}

export default ListRow