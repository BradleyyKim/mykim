"use client";

import { useState, useEffect } from "react";
import { AVATAR } from "@/lib/constants";

export function useDailyAvatar() {
  const [currentAvatar, setCurrentAvatar] = useState<string>(AVATAR.DEFAULT);

  const getAvatarByDate = (date: Date): string => {
    const dayOfMonth = date.getDate(); // 1-31
    const index = dayOfMonth % AVATAR.IMAGES.length;
    return AVATAR.IMAGES[index];
  };

  useEffect(() => {
    const updateAvatar = () => {
      const now = new Date();
      const newAvatar = getAvatarByDate(now);
      setCurrentAvatar(newAvatar);
    };

    // 초기 설정
    updateAvatar();

    // 매일 자정에 업데이트
    const msUntilMidnight = 24 * 60 * 60 * 1000 - (new Date().getTime() % (24 * 60 * 60 * 1000));

    const timeout = setTimeout(() => {
      updateAvatar();
      // 이후 24시간마다 업데이트
      const interval = setInterval(updateAvatar, 24 * 60 * 60 * 1000);

      return () => clearInterval(interval);
    }, msUntilMidnight);

    return () => clearTimeout(timeout);
  }, []);

  return {
    currentAvatar,
    getAvatarByDate
  };
}
