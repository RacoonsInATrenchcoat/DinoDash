import React, { useEffect, useRef, useMemo } from "react";
import { useVolumeContext, useLevelContext, useMusicContext } from "./Context";

// Module-level variable to store a single audio instance.
let globalAudioInstance = null;

// Throttle helper function to limit expensive operations.
const throttle = (func, limit) => {
  let inThrottle = false;
  return (...args) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

const MusicPlayer = React.memo(() => {
  const { volume } = useVolumeContext();
  const { level } = useLevelContext();
  const { isPlaying } = useMusicContext(); // Read isPlaying from context
  const audioRef = useRef(null);
  const lastPlayedTrack = useRef(null);
  const audioCache = useRef({});

  // Memoize the level-to-track mapping.
  const levelMusic = useMemo(
    () => ({
      1: "/static/TTD_01.mp3",
      2: "/static/TTD_02.mp3",
      3: "/static/TTD_03.mp3"
    }),
    []
  );

  // Initialize the audio element only once using a module-level variable.
  useEffect(() => {
    if (globalAudioInstance) {
      audioRef.current = globalAudioInstance;
    } else {
      const audio = new Audio();
      audio.preload = "auto";
      audio.loop = true;  // Ensure looping is enabled
      audioRef.current = audio;
      globalAudioInstance = audio;
    }
  }, []);

  // Preload all tracks on mount.
  useEffect(() => {
    Object.values(levelMusic).forEach((src) => {
      if (!audioCache.current[src]) {
        const audio = new Audio(src);
        audio.preload = "auto";
        audioCache.current[src] = audio;
      }
    });
  }, [levelMusic]);

  // Update volume only when it changes.
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // Throttled update for handling track change and play/pause operations.
  const updateAudio = useMemo(
    () =>
      throttle(() => {
        const audio = audioRef.current;
        if (!audio) return;

        // Determine new track based on level.
        const newSrc = levelMusic[level] || levelMusic[1];
        // Only update track if it has changed.
        if (lastPlayedTrack.current !== newSrc) {
          lastPlayedTrack.current = newSrc;
          if (!audio.paused) audio.pause();
          audio.src = newSrc;
          audio.load();
        }

        // Only trigger play if isPlaying is true and audio is not already playing.
        if (isPlaying) {
          if (audio.paused) {
            setTimeout(() => {
              audio
                .play()
                .catch((error) =>
                  console.warn("⚠️ Autoplay blocked, waiting for user interaction:", error)
                );
            }, 100);
          }
        } else {
          // Pause only if audio is not already paused.
          if (!audio.paused) {
            audio.pause();
          }
        }
      }, 300),
    [level, isPlaying, levelMusic]
  );

  useEffect(() => {
    updateAudio();
  }, [updateAudio, level, isPlaying]);

  return <audio ref={audioRef} preload="auto" />;
});

export default MusicPlayer;
