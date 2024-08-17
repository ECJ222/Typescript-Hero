import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Observer } from 'gsap/Observer'
import Lottie from 'lottie-react'
import { useResize, useScroll } from './hooks'
import { Lesson } from './components'
import { FRAME_TO_PAUSE, FRAME_COUNT, MAX_LOADED_IMAGES } from './utils/constants'
import { isHTMLElement } from './utils/helpers'
import SwipeUpAnimation from './utils/swipeup.json'

interface GameSystemProps {
  startEndAnimation: () => void
  resetEndAnimation: () => void
  imageLoaded: () => void
}

export default function GameSystem({ startEndAnimation, resetEndAnimation, imageLoaded }: GameSystemProps) {
  const images = useRef<HTMLImageElement[]>([])
  const currentIndex = useRef(1)
  const allowScroll = useRef(false)
  const isScrollingUp = useRef(false)
  const scrollTimeout = useRef<gsap.core.Tween | null>(null)
  const observer = useRef<Observer | null>(null)
  const scrollTrigger = useRef<ScrollTrigger | null>(null)
  const isScrollable = useRef(true)
  const [isLessonOpen, setIsLessonOpen] = useState(false)
  const { width, height } = useResize()
  const { isScrolling, handleScroll } = useScroll()

  const checkImagesLoaded = () => {
    const hasImagesLoaded = images.current.every((image) => {
      return image.complete
    })

    if (hasImagesLoaded) {
      imageLoaded()
    }

    return hasImagesLoaded
  }

  const handleImageLoading = () => {
    const interval = setInterval(() => {
      const hasImagesLoaded = checkImagesLoaded()

      if (hasImagesLoaded) {
        clearInterval(interval)
      }
    }, 1000)
  }

  const getImageUrl = (frame: number) => {
    const filePath = `/assets/screens/anim${String(frame).padStart(4, '0')}.png`
    return new URL(filePath, import.meta.url).href
  }

  const createInitialImages = () => {
    const tempImages: HTMLImageElement[] = []
    images.current = []

    for (let frame = 1; frame <= MAX_LOADED_IMAGES; frame++) {
      const img = new Image()
      img.src = getImageUrl(frame)
      tempImages.push(img)
    }

    images.current.push(...tempImages)
    handleImageLoading()
  }

  const addMoreImages = () => {
    const imageLength = images.current.length
    const tempImages: HTMLImageElement[] = []
    for (let frame = imageLength + 1; frame <= imageLength + MAX_LOADED_IMAGES; frame++) {
      const img = new Image()
      img.src = getImageUrl(frame)
      tempImages.push(img)
    }
    images.current.push(...tempImages)
  }

  const drawImage = () => {
    const padding = String(currentIndex.current).padStart(4, '0')
    const image = images.current.find((image) => image.src.includes(`anim${padding}`))
    const canvas = document.querySelector('canvas') as HTMLCanvasElement
    canvas.style.width = `100%`
    canvas.style.height = `100%`

    const context = canvas.getContext('2d') as CanvasRenderingContext2D
    context.canvas.width = width
    context.canvas.height = height
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.drawImage(image!, 0, 0, canvas.width, canvas.height)
  }

  const handleFrameScroll = () => {
    currentIndex.current = isScrollingUp.current ? currentIndex.current + 1 : currentIndex.current - 1
    const isAtBeginning = currentIndex.current < 2
    const isAtEnd = currentIndex.current > FRAME_COUNT - 2

    if (isAtEnd || isAtBeginning) {
      observer.current?.disable()
      if (!isScrollingUp.current) {
        scrollTrigger.current?.scroll(scrollTrigger.current.start)
      } else {
        if (isAtEnd) {
          startEndAnimation()
        }

        scrollTrigger.current?.scroll(scrollTrigger.current.end)
      }
      return
    }

    if (currentIndex.current === FRAME_COUNT - 10) {
      resetEndAnimation()
    }

    allowScroll.current = false
    scrollTimeout.current?.restart(true)

    const target = images.current[currentIndex.current]
    if (target) {
      gsap.to(target, {
        yPercent: isScrollingUp.current ? -10 : 0,
        duration: 0.75,
        onUpdate: drawImage
      })

      handleScroll()
      const futureIndex = isScrollingUp.current ? currentIndex.current + 1 : currentIndex.current - 1
      if (FRAME_TO_PAUSE.includes(futureIndex)) {
        pauseGame()
      }
    }
  }

  const repositionBackToGame = () => {
    const hasScrollPastBeginning = currentIndex.current > 1
    const hasNotScrolledPastEnd = currentIndex.current < FRAME_COUNT - 1
    if (hasScrollPastBeginning && hasNotScrolledPastEnd && (isLessonOpen || !isScrolling)) {
      observer.current?.disable()
      setTimeout(() => {
        goToGame()
        if (!isLessonOpen) {
          observer.current?.enable()
        }
      }, 1000)
    }
  }

  const pauseGame = () => {
    isScrollable.current = false
    const screen = document.querySelector('.screen')!
    if (width <= 1024 && isHTMLElement(screen)) {
      screen.style.overflow = 'hidden'
    }
    setIsLessonOpen(true)
    observer.current?.disable()
  }

  const continueGame = () => {
    goToGame()
    const screen = document.querySelector('.screen')
    const lesson = document.querySelector('.lesson')
    if (isHTMLElement(screen!) && isHTMLElement(lesson!)) {
      screen.style.overflow = 'initial'
      lesson.style.position = 'absolute'
      setIsLessonOpen(false)
    }

    isScrollable.current = true
    observer.current?.enable()
  }

  const preventScroll = useCallback((e: Event) => {
    const el = e.target as HTMLElement

    if (!isScrollable.current) {
      if (el.tagName.toLowerCase() !== 'code') {
        e.preventDefault()
        e.stopPropagation()
      }

      if (el.tagName.toLowerCase() !== 'canvas') {
        goToGame()
      }
    } else {
      setIsLessonOpen(false)
    }
  }, [])

  const preventKeyboardScroll = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault()
      e.stopPropagation()

      window.setTimeout(() => {
        setIsLessonOpen(true)
        observer.current?.disable()
      }, 1000)

      return false
    }
  }, [])

  const onObserverEnable = (self: Observer & { _restoreScroll?: () => void }) => {
    allowScroll.current = false
    scrollTimeout.current?.restart(true)
    const pageScrolledAmount = window.pageYOffset || document.documentElement.scrollTop
    const game = document.querySelector('.screen__game') as HTMLElement
    const gameTopPosition = game.getBoundingClientRect().top
    const savedScroll = gameTopPosition + pageScrolledAmount
    self._restoreScroll = () => {
      self.scrollY(savedScroll)
    }
    document.addEventListener('scroll', self._restoreScroll, { passive: false })
  }

  const goToGame = () => {
    gsap.to(window, { scrollTo: { y: '.screen__game', offsetY: 0 } })
  }

  useEffect(() => {
    createInitialImages()
  }, [])

  useLayoutEffect(() => {
    // Move through frames when animation timeline is available.
    scrollTimeout.current = gsap.delayedCall(0.00001, () => (allowScroll.current = true)).pause()

    observer.current = ScrollTrigger.observe({
      wheelSpeed: -1,
      type: 'wheel,touch',
      onUp: () => {
        if (currentIndex.current < FRAME_COUNT - 1 && isScrollable.current) {
          isScrollingUp.current = true
          allowScroll.current && handleFrameScroll()
        }
      },
      onDown: () => {
        if (currentIndex.current > 1 && isScrollable.current) {
          isScrollingUp.current = false
          allowScroll.current && handleFrameScroll()
        }
      },
      tolerance: 5,
      preventDefault: true,
      onEnable(self) {
        onObserverEnable(self)
      },
      onDisable: (self: Observer & { _restoreScroll?: () => void }) =>
        self._restoreScroll && document.removeEventListener('scroll', self._restoreScroll)
    })

    observer.current.disable()

    scrollTrigger.current = ScrollTrigger.create({
      trigger: '.screen__game',
      pin: true,
      start: 'top top',
      end: '+=10',
      onEnter: (self) => {
        if (observer.current?.isEnabled || isScrollingUp.current) {
          return
        }
        self.scroll(self.start + 1)
        observer.current?.enable()
      },
      onEnterBack: (self) => {
        if (observer.current?.isEnabled || !isScrollingUp.current) {
          return
        }
        self.scroll(self.end - 1)
        observer.current?.enable()
      }
    })
  }, [])

  useEffect(() => {
    const image = images.current[currentIndex.current]

    if (image) {
      if (!image.onload) {
        image.onload = () => drawImage()
      }
      repositionBackToGame()
    }
  }, [width, height])

  useEffect(() => {
    const screen = document.querySelector('.screen') as HTMLElement

    screen.addEventListener('wheel', preventScroll, { passive: false })
    screen.addEventListener('touchmove', preventScroll, { passive: false })
    document.addEventListener('keydown', preventKeyboardScroll, { passive: false })

    return () => {
      screen.removeEventListener('wheel', preventScroll)
      screen.removeEventListener('touchmove', preventScroll)
      document.removeEventListener('keydown', preventKeyboardScroll)
    }
  }, [preventScroll, preventKeyboardScroll])

  useEffect(() => {
    if (isLessonOpen && images.current.length !== FRAME_COUNT) {
      addMoreImages()
    }
  }, [isLessonOpen])

  return (
    <section className="screen__game">
      <canvas></canvas>
      {currentIndex.current > 0 && currentIndex.current < FRAME_COUNT - 1 && !isScrolling && isScrollable.current && !isLessonOpen && (
        <Lottie className="swipe-up" animationData={SwipeUpAnimation} loop={true} />
      )}
      {isLessonOpen && <Lesson topicIndex={currentIndex.current} onContinue={continueGame} />}
    </section>
  )
}
