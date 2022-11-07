import ButtonDark from "../../button-dark"
import ButtonLight from "../../button-light"
import ButtonGreen from "../../button-green"
import { useRouter } from "next/router"
import Image from "next/image"

const ListRow = ({item}) => {
    const router = useRouter()

    return (
        <div className="bg-white w-[1032px] min-h-[145px] rounded-xl shadow-lg flex flex-row items-center gap-5 p-[12px] mx-auto ml-[64px] border-[0.5px] border-[#E0E0E0]">
        <div className="min-w-[200px] h-[117px]">
          <Image
            className="object-cover w-fit h-fit rounded-lg"
            src={!item.cover_url ? "/assets/banners/leaves-min.jpeg" : item.cover_url}
            width="200px"
            height="117px"
          />
        </div>
        <div className="flex flex-col">
          <p className="text-xl font-bold font-[Montserrat] text-[#0D1011] mb-[8px]">
          {item.title}
          </p>
          <p className="text-black/50 font-[Poppins] font-normal text-[14px] mb-[8px]">
          {item.description}
          </p>
          <p className="font-[Montserrat] font-bold text-[24px] text-[#0D1011]">
            $45
          </p>
        </div>
        <div className="flex flex-col ml-auto my-auto gap-[8px]">
          <ButtonGreen
            text="Download File"
            className="w-[160px]"
            onClick={() => {
              router.push(item.url);
            }}
          />
          <ButtonDark
            text="Edit"
            className="w-[160px] h-[35px] text-[10px] font-bold bg-[#061A40]"
          />
          <ButtonLight text="Unpublish" className="w-[160px]" />
        </div>
          </div>
    )
}

export default ListRow

