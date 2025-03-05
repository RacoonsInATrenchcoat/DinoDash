import React, { useEffect, useRef } from "react";
import { useVolumeContext, useLevelContext } from "./Context"; 

const MusicPlayer = ({ isPlaying }) => {
  const { volume } = useVolumeContext();
  const { level } = useLevelContext();
  const audioRef = useRef(null);
  const lastPlayedTrack = useRef(null);
  const audioCache = useRef({}); // ✅ Store preloaded audio elements

  console.log("🎵 Current Level:", level);

  const levelMusic = {
    1: "/static/TTD_01.mp3",
    2: "/static/TTD_02.mp3",
    3: "/static/TTD_03.mp3",
  };

  // ✅ Preload all tracks on mount
  useEffect(() => {
    Object.values(levelMusic).forEach((src) => {
      if (!audioCache.current[src]) {
        const audio = new Audio(src);
        audio.preload = "auto";
        audioCache.current[src] = audio;
        console.log(`🔄 Preloading track: ${src}`);
      }
    });
  }, []);

  // ✅ Set volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // ✅ Change track instantly when level changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const newSrc = levelMusic[level] || levelMusic[1];

    if (lastPlayedTrack.current === newSrc) return; // ✅ Prevent unnecessary updates
    lastPlayedTrack.current = newSrc;

    console.log(`🎵 Switching music to: ${newSrc}`);

    audio.pause();
    audio.src = newSrc;
    audio.load(); // ✅ Ensure the new track is properly loaded

    if (isPlaying) {
      setTimeout(() => {
        audio.play().catch(error => {
          console.warn("⚠️ Autoplay blocked, waiting for user interaction:", error);
        });
      }, 100);
    }
  }, [level]);

  // ✅ Handle play/pause behavior
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      console.log("▶️ Playing audio...");
      audio.play().catch(error => {
        console.warn("⚠️ Autoplay blocked, waiting for user interaction:", error);
      });
    } else {
      console.log("⏸️ Pausing audio...");
      audio.pause();
    }
  }, [isPlaying]);

  return <audio ref={audioRef} preload="auto" loop />;
};

export default MusicPlayer;
