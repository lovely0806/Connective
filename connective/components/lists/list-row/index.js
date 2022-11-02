import ButtonDark from "../../button-dark";
import ButtonLight from "../../button-light";
import Image from "next/image";
import axios from "axios";
import { useState } from "react";
import Link from "next/link";

const ListRow = ({ item }) => {
  const [published, setPublished] = useState(item.published);

  const togglePublish = async () => {
    if (published) {
      axios.post(`/api/lists/unpublish/${item.id}`);
      setPublished(false);
    } else {
      axios.post(`/api/lists/publish/${item.id}`);
      setPublished(true);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg flex flex-row gap-5 p-5">
      <div className="rounded-xl object-cover h-48 w-80 relative overflow-hidden">
        <Image
          layout="fill"
          objectFit="cover"
          src={
            !item.cover_url ? "/assets/banners/leaves-min.jpeg" : item.cover_url
          }
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
        <Link href={`lists/edit/${item.id}/1`}>
          <ButtonDark text="Edit" className="w-full mt-auto"></ButtonDark>
        </Link>
        <ButtonLight
          text={published ? "Unpublish" : "Publish"}
          className="w-full mb-auto"
          onClick={togglePublish}
        ></ButtonLight>
      </div>
    </div>
  );
};

export default ListRow;
