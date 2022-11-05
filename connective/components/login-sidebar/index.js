import Image from "next/image";
import bgImg from "../../public/assets/Right.svg";

const LoginSidebar = () => {
  return (
    <div className="min-w-[620px] h-fill my-[32px] mr-[32px] 2bp:min-w-[520px]">
      <div>
        <Image
          className="rounded-[16px]"
          src={bgImg}
          alt="bg"
          width="620px"
          height="837px"
          priority
        />
      </div>

      {/* <div className="absolute bottom-0 z-[10] px-[60px] mb-[208px]">
        <h1 className="max-w-[403px] font-[Montserrat] text-[#F2F4F5] font-bold text-[40px] leading-[49px] mb-[24px] 1bp:text-[54px] 1bp:leading-[59px]">
          Curated B2B Assets Monetized
        </h1>
        <p className="max-w-[454px] font-[Montserrat] text-[#F2F4F5] font-light text-[20px] leading-[150%] 1bp:text-[24px]">
          Connective is an open marketplace designed for businesses to help each
          other grow through buying and selling digital assets.
        </p>
      </div> */}
    </div>
  );
};

export default LoginSidebar;
