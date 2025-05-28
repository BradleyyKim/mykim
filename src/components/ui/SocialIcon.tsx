import Image from "next/image";
import { Rss } from "lucide-react";

type SocialIconType = "linkedin" | "github" | "rss";

interface SocialIconProps {
  type: SocialIconType;
  size?: number;
  className?: string;
}

const SOCIAL_ICONS = {
  linkedin: {
    src: "/images/icons/linkedinLogo.png",
    alt: "LinkedIn",
    hoverEffect: "hover:opacity-80"
  },
  github: {
    src: "/images/icons/githubLogo.png",
    alt: "GitHub",
    hoverEffect: "hover:opacity-80"
  }
} as const;

export default function SocialIcon({ type, size = 20, className = "" }: SocialIconProps) {
  // RSS는 여전히 Lucide 아이콘 사용 (deprecated 되지 않음)
  if (type === "rss") {
    return <Rss className={`text-orange-500 group-hover:text-orange-600 ${className}`} style={{ width: size, height: size }} />;
  }

  // 커스텀 이미지 아이콘 사용
  const icon = SOCIAL_ICONS[type];

  return <Image src={icon.src} alt={icon.alt} width={size} height={size} className={`object-contain transition-opacity duration-200 ${icon.hoverEffect} ${className}`} />;
}
