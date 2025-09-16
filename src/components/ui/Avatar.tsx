"use client";

import Image from "next/image";
import { AVATAR } from "@/lib/constants";
import { useDailyAvatar } from "@/hooks/ui";

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: keyof typeof AVATAR.SIZES | keyof typeof AVATAR.RESPONSIVE_SIZES;
  className?: string;
  enableDailyAvatar?: boolean;
  responsive?: boolean; // 반응형 모드 활성화
}

export default function Avatar({
  src,
  alt = AVATAR.ALT,
  size = "MD",
  className = "",
  enableDailyAvatar = false,
  responsive = false
}: AvatarProps) {
  // Daily 아바타 훅 사용
  const { currentAvatar } = useDailyAvatar();

  // 아바타 소스 결정: Daily 아바타 > 기본 src
  const avatarSrc = enableDailyAvatar ? currentAvatar : src || AVATAR.DEFAULT;

  // 반응형 모드인지 확인
  if (responsive || size === "RESPONSIVE") {
    const responsiveSize =
      size === "RESPONSIVE"
        ? AVATAR.RESPONSIVE_SIZES.RESPONSIVE
        : AVATAR.RESPONSIVE_SIZES[size as keyof typeof AVATAR.RESPONSIVE_SIZES];

    return (
      <div className={`relative overflow-hidden rounded-full ${responsiveSize} ${className}`}>
        <Image
          src={avatarSrc}
          alt={alt}
          fill
          className="object-cover"
          priority={size === "LG" || size === "XL" || size === "RESPONSIVE"}
        />
      </div>
    );
  }

  // 기본 고정 사이즈 모드
  const avatarSize = AVATAR.SIZES[size as keyof typeof AVATAR.SIZES];

  return (
    <div className={`relative overflow-hidden rounded-full ${className}`}>
      <Image
        src={avatarSrc}
        alt={alt}
        width={avatarSize}
        height={avatarSize}
        className="object-cover"
        priority={size === "LG" || size === "XL"}
      />
    </div>
  );
}
