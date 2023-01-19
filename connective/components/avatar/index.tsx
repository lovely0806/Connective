import { createAvatar } from "@dicebear/avatars";
import * as style from "@dicebear/avatars-initials-sprites";
import Image from "next/image";

type Props = {
  title: string;
  width?: number | string;
  height?: number | string;
  className?: string;
};

const Avatar = ({
  title,
  width = null,
  height = null,
  className = null,
}: Props) => {
  let avatar = createAvatar(style, {
    seed: title,
    dataUri: true,
    fontSize: width ? 40 : 25,
  });

  return (
    <div>
      <Image
        objectFit="cover"
        className={className || "rounded"}
        layout={width ? "responsive" : "fill"}
        width={width ? width : 0}
        height={height ? height : 0}
        src={avatar}
      />
    </div>
  );
};

export default Avatar;
