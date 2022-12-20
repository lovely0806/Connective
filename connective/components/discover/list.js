import Image from "next/image";
import { useRouter } from "next/router";
import Avatar from "components/avatar/index"

const DiscoverList = ({ id, title, description, imgURL }) => {
  const router = useRouter();

  return (
    <div  className="flex flex-row w-full h-44 shadow-lg bg-white rounded justify-between gap-2">
      <div  className="w-60 relative m-3 rounded-sm shrink-0">
      { imgURL ? <Image
          layout="fill"
          objectFit="cover"
           className="rounded"
          src={imgURL}
        /> : <Avatar title={title}/>}
      </div>
      <div  className="w-full my-8 overflow-y-clip">
        <p  className="text-xl font-bold my-1">{title}</p>
        <p  className="text-sm h-full">
          {description.length > 450
            ? description.slice(0, 450) + "..."
            : description}
        </p>
      </div>
      <div  className="w-60 shrink-0 flex flex-col justify-center items-center gap-3 m-5">
        <button  className="text-sm font-normal bg-[#006494] font-[Poppins]"
          onClick={() => router.push(`/app/profile/${id}`)}>
          View Profile
        </button>

        <button
           className="text-sm font-normal bg-[#061A40] font-[Poppins]"
          onClick={() => router.push(`/app/messages?newUser=${id}`)}
        >
          Start a chat
        </button>
      </div>
    </div>
  );
};

export default DiscoverList;
