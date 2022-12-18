import ButtonDark from "../../button-dark";
import { useRouter } from "next/router";
import Image from "next/image";
import { useEffect, useState } from "react";
import Util from "../../../util";
import axios from "axios";

const ListCard = ({ item, preview, user }) => {
  const router = useRouter();
  const [truncatedTitle, setTruncatedTitle] = useState("");
  const [truncatedDesc, setTruncatedDesc] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [username, setUsername] = useState("");

  //console.log(item)

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
    <div  className="w-[350px] h-fill bg-white rounded-[8px] p-[12px] flex flex-col justify-between font-[Montserrat] drop-shadow-lg border-[0.5px] border-[#E0E0E0]">
      <div>
        <div>
          <img
             className="object-cover w-full h-[153px] mb-[12px] rounded-[8px]"
            src={
              item.cover_url == "undefined" ||
              !item.cover_url ||
              item.cover_url == "" ||
              item.cover_url == "null"
                ? "/assets/banners/leaves-min.jpeg"
                : item.cover_url
            }
            alt="List image"
          />
        </div>
        <p  className="font-bold text-[18px] leading-[20px] text-[#0D1011] mb-[12px]">
          {truncatedTitle}
        </p>
        <p  className="font-normal text-[12px] leading-[18px] text–[rgba(13_16_17_0.7)] mb-[15px] text-[#0d1011b3]">
          {truncatedDesc}
        </p>
      </div>

      <div>
        <div  className="flex flex-row justify-between items-center mb-[12px]">
          <div  className="bg-[#D2F8DF] rounded-[50px] w-fit text-[#06A83D] font-bold text-[14px] leading-[14px] py-[11px] px-[16px]">
            {preview ? 0 : item.buyers} {item.buyers == 1 ? "Buyer" : "Buyers"}
          </div>
          <p  className="font-bold text-[26px] leading-[29px] text-[#0D1011]">
            ${parseInt(item.price).toFixed(2)}
          </p>
        </div>
        {!preview && (
          <div  className="w-[100%]">
            <ButtonDark
              onClick={() => {
                router.push(`/app/marketplace/list-details/${item.id}`);
              }}
              text="More Details"
               className="bg-[#061A40] text-sm"
            ></ButtonDark>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListCard;