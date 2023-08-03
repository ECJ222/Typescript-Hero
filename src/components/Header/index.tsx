import { useState, useRef, useEffect } from "react";
import { SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/24/solid";
import Audio from "../../assets/audio/Intro.mp3";
import "./Header.scss";

const Logo = require("../../assets/icons/Logo.svg");

const Header = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioElement = useRef<HTMLAudioElement | null>(null);

  const playAudio = () => {
    const el = audioElement.current as HTMLAudioElement;
    el.volume = 0.5;
    audioElement.current = el;

    el.play();
    setIsPlaying(true);
  };

  const pauseAudio = () => {
    const el = audioElement.current as HTMLAudioElement;
    el.pause();
    setIsPlaying(false);
  };

  return (
    <header className="header">
      <nav>
        <img className="rotate" src={Logo.default} alt="The intro logo" />

        <button aria-roledescription={isPlaying ? "play-button" : "pause-button"} onClick={isPlaying ? pauseAudio : playAudio}>
          {!isPlaying ? <SpeakerXMarkIcon fill="#fff" width="26" height="26" /> : <SpeakerWaveIcon fill="#fff" width="26" height="26" />}
        </button>

        <audio ref={audioElement} src={Audio} loop></audio>
      </nav>
    </header>
  );
};

export default Header;
