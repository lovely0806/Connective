import { useState } from "react";
import person from "../../../public/assets/person.svg";
import business from "../../../public/assets/business.svg";
import Image from "next/image";

const ProfileTypeSelector = ({ type, setType }) => {
  let unselectedClass =
    "font-[Montserrat] cursor-pointer text-black bg-white flex flex-row gap-2 px-10 py-2 border-2 border-black h-[47px] flex items-center justify-center rounded-lg border-[1px] border-[#0F172A] w-fill flex flex-row items-center justify-center";
  let selectedClass =
    "font-[Montserrat] cursor-pointer bg-[#0F172A] text-white flex flex-row gap-2 px-10 py-2 border-2 border-black/50 h-[47px] flex items-center justify-center rounded-lg border-[1px] border-[#0F172A] w-fill flex flex-row items-center justify-center";

  return (
    <div  className="flex flex-row gap-5 mx-auto">
      <div  className="w-[229px] rounded-lg">
        <div
          onClick={() => {
            setType("business");
          }}
           className={type == "business" ? selectedClass : unselectedClass}
        >
          <div  className="h-fit mt-[5px]">
            {type == "business" ? (
              <Image
                src="/assets/business-white.svg"
                alt="Connective logo"
                width="20px"
                height="20px"
              />
            ) : (
              <Image
                src="/assets/business.svg"
                alt="Connective logo"
                width="20px"
                height="20px"
              />
            )}
          </div>
          <p  className="font-bold text-[12px] leading-[15px]">
            I am a business
          </p>
        </div>
      </div>

      <div  className="w-[229px] rounded-lg">
        <div
          onClick={() => {
            setType("individual");
          }}
           className={type == "individual" ? selectedClass : unselectedClass}
        >
          <div  className="h-fit mt-[5px]">
            {type == "individual" ? (
              <Image
                src="/assets/person-white.svg"
                alt="Connective logo"
                width="20px"
                height="20px"
              />
            ) : (
              <Image
                src="/assets/person.svg"
                alt="Connective logo"
                width="20px"
                height="20px"
              />
            )}
          </div>
          <p  className="font-bold text-[12px] leading-[15px]">
            I am an Individual
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileTypeSelector;

{
  /* <div  className="flex flex-row gap-[10px]">
          <Image src={person} alt="Individual" width="16.67px" height="15px" />
          <p  className="font-bold text-[12px] leading-[15px]">
            I am an Individual
          </p>
        </div> */
}
