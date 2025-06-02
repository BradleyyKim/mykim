"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const DAY_IMAGES = ["/images/background/day1.webp", "/images/background/day2.webp", "/images/background/day3.webp"];

const NIGHT_IMAGES = ["/images/background/night1.webp"];

const DAY_START_HOUR = 6;
const DAY_END_HOUR = 18;

export function useTimeBasedBackground() {
  const [currentBackground, setCurrentBackground] = useState<string>("");
  const [isDayTime, setIsDayTime] = useState<boolean>(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const getRandomImage = useCallback((images: string[]): string => {
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  }, []);

  const getCurrentTimeBasedImage = useCallback((): { image: string; isDayTime: boolean } => {
    const now = new Date();
    const currentHour = now.getHours();

    const isDayTime = currentHour >= DAY_START_HOUR && currentHour < DAY_END_HOUR;
    const image = isDayTime ? getRandomImage(DAY_IMAGES) : getRandomImage(NIGHT_IMAGES);

    return { image, isDayTime };
  }, [getRandomImage]);

  const updateBackground = useCallback(() => {
    const { image, isDayTime } = getCurrentTimeBasedImage();
    setCurrentBackground(image);
    setIsDayTime(isDayTime);
  }, [getCurrentTimeBasedImage]);

  const refreshBackground = useCallback(() => {
    updateBackground();
  }, [updateBackground]);

  useEffect(() => {
    // 초기 설정
    updateBackground();

    // 다음 시간(정시)까지의 시간 계산
    const now = new Date();
    const nextHour = new Date(now);
    nextHour.setHours(now.getHours() + 1, 0, 0, 0);
    const msUntilNextHour = nextHour.getTime() - now.getTime();

    // 첫 번째 타이머: 다음 정시까지 기다린 후 실행
    const timeout = setTimeout(() => {
      updateBackground();

      // 이후 매 시간마다 실행하는 인터벌 설정
      intervalRef.current = setInterval(updateBackground, 60 * 60 * 1000); // 1시간마다
    }, msUntilNextHour);

    return () => {
      clearTimeout(timeout);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [updateBackground]);

  return {
    currentBackground,
    isDayTime,
    refreshBackground
  };
}
