import { useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { clsx } from 'clsx'
import { Preload } from './components'
import Header from './components/Header'
import Intro from './components/Intro'
import GameSystem from './GameSystem'
import { isHTMLElement } from './utils/helpers'
import './app.scss'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

export default function App() {
  const [isEndAnimationPlaying, setIsEndAnimationPlaying] = useState(false)
  const [isImageLoaded, setImagesLoading] = useState(true)

  const startEndAnimation = () => {
    setIsEndAnimationPlaying(true)
  }

  const resetEndAnimation = () => {
    setIsEndAnimationPlaying(false)
  }

  const handleLoading = () => {
    setImagesLoading(false)
  }

  const scrollToIntroScreen = () => {
    const screenIntroEl = document.querySelector('.screen__start')
    if (isHTMLElement(screenIntroEl!)) {
      screenIntroEl.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    window.history.scrollRestoration = 'manual'
    ScrollTrigger.clearScrollMemory()

    scrollToIntroScreen()
  }, [])

  return (
    <div className={clsx({ screen: true, hidden: isImageLoaded })}>
      {isImageLoaded && <Preload />}
      <section className="screen__start">
        <Header />
        <Intro />
      </section>
      <GameSystem startEndAnimation={startEndAnimation} resetEndAnimation={resetEndAnimation} imageLoaded={handleLoading} />
      <section className="screen__end">
        <Preload fullScreen={false} start={isEndAnimationPlaying} infinite={false} />
        <span className="text">Made with ✨ by Enoch Chejieh</span>
      </section>
    </div>
  )
}
