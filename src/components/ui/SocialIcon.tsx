import Image from "next/image";
import { Rss, Mail, Instagram } from "lucide-react";

type SocialIconType = "linkedin" | "github" | "rss" | "email" | "instagram";

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
  // Lucide 아이콘들 (RSS, Email, Instagram)
  if (type === "rss") {
    return <Rss className={`text-orange-500 group-hover:text-orange-600 ${className}`} style={{ width: size, height: size }} />;
  }

  if (type === "email") {
    return <Mail className={`text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 ${className}`} style={{ width: size, height: size }} />;
  }

  if (type === "instagram") {
    return <Instagram className={`text-pink-500 group-hover:text-pink-600 ${className}`} style={{ width: size, height: size }} />;
  }

  // 커스텀 이미지 아이콘 사용
  const icon = SOCIAL_ICONS[type];

  return <Image src={icon.src} alt={icon.alt} width={size} height={size} className={`object-contain transition-opacity duration-200 ${icon.hoverEffect} ${className}`} />;
}
