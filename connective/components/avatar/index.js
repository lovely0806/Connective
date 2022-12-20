import { createAvatar } from '@dicebear/avatars'
import * as style from '@dicebear/avatars-initials-sprites'
import Image from 'next/image'

const Avatar = ({title, width, height, className}) => {
    let avatar = createAvatar(style, {
      seed: title,
      dataUri: true,
      fontSize: width ? 40 : 25
    })
    return (
        <div>
        <Image objectFit="cover" className={className || 'rounded'} layout={width ? "" : "fill"} width={width} height={height} src={avatar} />
        </div>
    )
}

export default Avatar