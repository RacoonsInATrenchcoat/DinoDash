import React, { useEffect, useRef } from "react";
import { useVolumeContext } from "./Context"; // ✅ Import volume context

const MusicPlayer = ({ isPlaying }) => {
  const { volume } = useVolumeContext(); // ✅ Get volume from context
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100; // ✅ Convert 0-100% to 0.0-1.0
    }
  }, [volume]); // ✅ Reacts to volume changes

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      const playAudio = async () => {
        try {
          await audio.play();
        } catch (error) {
          console.log("❌ Autoplay blocked, retrying on user interaction:", error);
        }
      };
      playAudio();
    } else {
      audio.pause();
      audio.currentTime = 0; // ✅ Reset playback when stopped
    }
  }, [isPlaying]);

  return (
    <audio ref={audioRef} src="/static/TTD_01.mp3" preload="auto" loop />
  );
};

export default MusicPlayer;
