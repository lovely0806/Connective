import Image from "next/image";
import closeIcon from "../../../public/assets/close.svg";

const RequestModal = ({ onClick }) => {
  return (
    <div className="overlay fixed left-0 top-0 bg-black/[.50] w-[100%] h-[100%] z-[30] flex justify-center items-center">
      <div className="w-[480px] h-[389px] p-[32px] rounded-lg bg-white">
        <div className="border-b-[1px] border-b-[#E0E0E0] pb-[24px] mb-[24px] flex flex-row justify-between items-center">
          <p className="font-[Poppins] font-bold text-[24px] leading-[29px] text-[#0D1011]">
            Submit your request
          </p>
          <Image
            className="cursor-pointer"
            src={closeIcon}
            alt="close"
            width="20px"
            height="20px"
            onClick={onClick}
          />
        </div>
        <input
          className="w-[416px] h-[46px] border-[1px] border-[#0D1011]/[.15] rounded-lg pl-[14px] mb-[24px]"
          type="text"
          placeholder="List Topic"
        />
        <textarea
          className="w-[416px] max-h-[120px] h-[120px] border-[1px] border-[#0D1011]/[.15] rounded-lg pl-[14px] mb-[26px]"
          placeholder="List Description"
        />
        <button
          className="w-full h-[39px] text-center bg-[#061A40] text-white font-[Poppins] font-medium text-[14px] leading-[17px]"
          onClick={onClick}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default RequestModal;