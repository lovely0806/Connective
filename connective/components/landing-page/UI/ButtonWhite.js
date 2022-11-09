import Image from "next/image";
import Link from "next/link";

const ButtonWhite = ({route, src, alt, text}) => {
  return (
    <Link href={`${route}`}>
      <div className="w-fit flex items-center gap-2.5 bg-white py-2.5 px-4 rounded-[50px] cursor-pointer">
          <Image
            src={`/assets/landing-page/${src}`}
            alt={`${alt}`}
            width="20px"
            height="20px"
          />
          <p className="text-xs font-semibold text-[#061A40]">{text}</p>
        </div>
    </Link>
  );
}

export default ButtonWhite;