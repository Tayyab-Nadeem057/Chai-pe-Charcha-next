"use client";

import { useEffect, useRef } from "react";

// Background hero video that plays at normal speed, pauses when you scroll past
// it, and RESTARTS from the beginning whenever you scroll back up to it.
// Scroll speed has no effect on playback.
export function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.currentTime = 0; // restart from the start
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 },
    );

    obs.observe(video);
    return () => obs.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      autoPlay
      muted
      loop
      playsInline
      poster="/hero-poster.jpg"
      className="absolute inset-0 h-full w-full object-cover opacity-90"
    >
      <source src="/hero.mp4" type="video/mp4" />
    </video>
  );
}
