import { useState, useRef } from 'react'
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/solid'

const Header = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioElement = useRef<HTMLAudioElement | null>(null)

  const playAudio = () => {
    const el = audioElement.current as HTMLAudioElement
    el.volume = 0.5
    audioElement.current = el

    el.play()
    setIsPlaying(true)
  }

  const pauseAudio = () => {
    const el = audioElement.current as HTMLAudioElement
    el.pause()
    setIsPlaying(false)
  }

  return (
    <header className="header">
      <nav>
        <img className="rotate" src="/assets/icons/logo.svg" alt="The intro logo" />

        <button aria-roledescription={isPlaying ? 'play-button' : 'pause-button'} onClick={isPlaying ? pauseAudio : playAudio}>
          {!isPlaying ? <SpeakerXMarkIcon fill="#fff" width="26" height="26" /> : <SpeakerWaveIcon fill="#fff" width="26" height="26" />}
        </button>

        <audio ref={audioElement} src="/assets/audio/intro.mp3" loop></audio>
      </nav>
    </header>
  )
}

export default Header
