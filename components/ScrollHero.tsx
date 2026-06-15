"use client";

import { useEffect, useRef } from "react";
import { HeroContent } from "./HeroContent";

// Cinematic hero: the video is pinned full-screen and SCRUBS to scroll position.
// Scroll down → plays forward, scroll up → plays backward, faster scroll → faster
// playback. The clip is mapped across the tall section's scroll distance, and a
// rAF "ease toward target" makes the scrubbing buttery instead of jumpy.
export function ScrollHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;

    let duration = 0;
    let target = 0; // desired progress 0..1
    let current = 0; // displayed progress 0..1
    let raf = 0;

    const onMeta = () => {
      duration = video.duration || 15;
    };
    video.addEventListener("loadedmetadata", onMeta);
    if (video.readyState >= 1) onMeta();

    const computeTarget = () => {
      const rect = section.getBoundingClientRect();
      const total = section.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      target = total > 0 ? scrolled / total : 0;
    };

    const loop = () => {
      current += (target - current) * 0.12; // smoothing
      if (duration) {
        const t = current * duration;
        if (Math.abs(video.currentTime - t) > 0.015) {
          try {
            video.currentTime = t;
          } catch {
            /* not seekable yet */
          }
        }
      }
      raf = requestAnimationFrame(loop);
    };

    computeTarget();
    window.addEventListener("scroll", computeTarget, { passive: true });
    window.addEventListener("resize", computeTarget);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", computeTarget);
      window.removeEventListener("resize", computeTarget);
      video.removeEventListener("loadedmetadata", onMeta);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[220vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        {/* Warm fallback (shows before the video paints) */}
        <div className="absolute inset-0 bg-gradient-to-br from-cocoa via-[#2a160a] to-coal" />

        {/* Scroll-scrubbed background video */}
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          poster="/hero-poster.jpg"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>

        {/* Dark, premium overlays */}
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-[#1a0d04]/55 to-coal/95" />
        <div className="absolute inset-0 [background:radial-gradient(120%_90%_at_50%_40%,transparent_35%,rgba(0,0,0,0.55)_100%)]" />

        <HeroContent />
      </div>
    </section>
  );
}
