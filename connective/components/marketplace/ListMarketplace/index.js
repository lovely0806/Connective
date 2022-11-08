import ButtonDark from "../../button-dark";
import { useRouter } from "next/router";
import Image from "next/image";
import { useEffect, useState } from "react";
import Util from "../../../util";
import axios from "axios";

const ListMarketplace = ({ item, preview, user }) => {
  const router = useRouter();
  const [truncatedTitle, setTruncatedTitle] = useState("");
  const [truncatedDesc, setTruncatedDesc] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [username, setUsername] = useState("");

  const getProfilePicture = async () => {
    let type = await Util.accountType(user.id);
    if (type == "Individual") {
      await axios.get("/api/profiles/individual").then((res) => {
        if (typeof res.data != "undefined") {
          console.log(res.data);
          setProfilePicture(res.data.profile_picture);
          setUsername(res.data.name);
        }
      });
    }
    if (type == "Business") {
      await axios.get("/api/profiles/business").then((res) => {
        if (typeof res.data != "undefined") {
          console.log(res.data);
          setProfilePicture(res.data.logo);
          setUsername(res.data.name);
        }
      });
    }
  };

  useEffect(() => {
    //console.log(item)
    if (typeof item.title == "undefined") return;

    let titleLen = 60;
    let descLen = 180;
    let isTitleLong = item.title.length > titleLen;
    let isDescLong = item.description.length > descLen;
    let temp = "";
    temp = item.title.slice(0, titleLen);
    if (isTitleLong) temp += "...";
    setTruncatedTitle(temp);
    temp = item.description.slice(0, descLen);
    if (isDescLong) temp += "...";
    setTruncatedDesc(temp);

    if (preview) {
      getProfilePicture();
    }
  }, [item]);

  return (
    <div className="bg-white flex flex-col gap-5 p-3 rounded-xl shadow-lg h-full">
      <div className="rounded-xl object-cover h-48 relative overflow-hidden">
        <Image
          layout="fill"
          objectFit="cover"
          src={
            item.cover_url == "undefined" ||
            !item.cover_url ||
            item.cover_url == "" ||
            item.cover_url == "null"
              ? "/assets/banners/leaves-min.jpeg"
              : item.cover_url
          }
        />
      </div>
      <p className="font-bold text-lg w-full h-10 mb-5">{truncatedTitle}</p>
      <p className="text-[#8A8888] text-sm overflow-clip h-36">
        {truncatedDesc}
      </p>

      <div className="flex flex-row justify-between">
        <div className="flex flex-row gap-1">
          {preview ? (
            <Image
              src={
                profilePicture == ""
                  ? `https://avatars.dicebear.com/api/micah/${user.id}.svg`
                  : profilePicture
              }
              className="rounded-full w-10 h-10 object-cover"
              width="40px"
              height="40px"
            />
          ) : (
            <Image
              src={
                item?.logo == ""
                  ? `https://avatars.dicebear.com/api/micah/${item.creator}.svg`
                  : item.logo
              }
              className="rounded-full w-10 h-10 object-cover"
              width="40px"
              height="40px"
            />
          )}
          <p className="font-[Poppins] my-auto text-[#0d101180] text-sm">
            {preview ? username : item?.username}
          </p>
        </div>
        <div className="flex flex-col text-right">
          <p className="text-[19px] font-bold">${parseInt(item.price).toFixed(2)}</p>
          <p className="text-[#0D1011] text-[12px]">
            {preview ? 0 : item.buyers} {item.buyers == 1 ? "buyer" : "buyers"}
          </p>
        </div>
      </div>

      {!preview && (
        <div>
          <ButtonDark
            onClick={() => {
              router.push(`/app/marketplace/list-details/${item.id}`);
            }}
            text="More Details"
            className="w-[100%] bg-[#061A40] text-sm"
          ></ButtonDark>
        </div>
      )}
    </div>
  );
};

export default ListMarketplace;
