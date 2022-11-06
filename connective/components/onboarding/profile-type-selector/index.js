import { useState } from "react";
import person from "../../../public/assets/person.svg";
import business from "../../../public/assets/business.svg";
import Image from "next/image";

const ProfileTypeSelector = ({ type, setType }) => {
  let unselectedClass =
    "font-[Montserrat] text-black bg-white flex flex-row gap-5 px-10 py-2 w-fit border-2 border-black h-[47px] flex items-center justify-center border-[2px] border-[#0F172A]";
  let selectedClass =
    "font-[Montserrat] bg-[#0F172A] text-white flex flex-row gap-5 px-10 py-2 w-fit border-2 border-black/50 h-[47px] flex items-center justify-center border-[2px] border-[#0F172A]";

  return (
    <div className="flex flex-row gap-5 mx-auto">
      <div className="border-[2px] border-[#0F172A] rounded-lg">
        <button
          onClick={() => {
            setType("business");
          }}
          className={type == "business" ? selectedClass : unselectedClass}
        >
          <p className="font-bold text-[12px] leading-[15px]">
            I am a business
          </p>
        </button>
      </div>

      <div className="border-[2px] border-[#0F172A] rounded-lg">
        <button
          onClick={() => {
            setType("individual");
          }}
          className={type == "individual" ? selectedClass : unselectedClass}
        >
          <p className="font-bold text-[12px] leading-[15px]">
            I am an Individual
          </p>
        </button>
      </div>
    </div>
  );
};

export default ProfileTypeSelector;

{
  /* <div className="flex flex-row gap-[10px]">
          <Image src={person} alt="Individual" width="16.67px" height="15px" />
          <p className="font-bold text-[12px] leading-[15px]">
            I am an Individual
          </p>
        </div> */
}
