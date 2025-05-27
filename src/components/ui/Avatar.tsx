import Image from "next/image";
import { AVATAR } from "@/lib/constants";

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: keyof typeof AVATAR.SIZES;
  className?: string;
}

export default function Avatar({ src = AVATAR.DEFAULT, alt = AVATAR.ALT, size = "MD", className = "" }: AvatarProps) {
  const avatarSize = AVATAR.SIZES[size];

  return (
    <div className={`relative overflow-hidden rounded-full ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={avatarSize}
        height={avatarSize}
        className="object-cover"
        priority={size === "LG" || size === "XL"} // 큰 아바타는 우선 로딩
      />
    </div>
  );
}
