import ButtonDark from "../../button-dark";
import ButtonLight from "../../button-light";
import ButtonGreen from "../../button-green";
import { useRouter } from "next/router";
import Image from "next/image";

const ListRow = ({ item, onClick }) => {
  const router = useRouter();

  return (
    <div className="mx-20 ml-[64px] h-screen mb-[100px] mt-[64px]">
      <div className="bg-white rounded-xl shadow-lg flex flex-row gap-5 p-5">
        <div className="rounded-xl object-cover h-48 w-[650px] relative overflow-hidden">
          <Image
            layout="fill"
            objectFit="cover"
            src={
              !item.cover_url
                ? "/assets/banners/leaves-min.jpeg"
                : item.cover_url
            }
          />
        </div>
        <div className="flex flex-col">
          <p className="text-xl font-bold">{item.title}</p>
          <p className="text-black/50">{item.description}</p>
          <div className="font-[Montserrat] font-bold text-[24px] text-[#0D1011] mt-auto">
            <p>${item.price.toFixed(2)}</p>
          </div>
        </div>
        <div className="flex flex-col ml-auto my-auto gap-5">
          <ButtonGreen
            text="Download CSV"
            className="mt-0 mb-0 w-full"
            onClick={() => {
              router.push(item.url);
            }}
          />
          <ButtonDark text="Leave Review" className="w-full mt-0 mb-0 bg-[#061A40]" onClick={onClick}/>
          <ButtonLight text="Explore More" className="w-full mt-0 mb-0" />
        </div>
      </div>
    </div>
  );
};

export default ListRow;
