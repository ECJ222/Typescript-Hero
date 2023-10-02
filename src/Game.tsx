import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Observer } from "gsap/Observer";
import Lottie from "lottie-react";
import { useResize, useScroll } from "./hooks";
import TutorialModal from "./components/TutorialModal/index";
import { FRAME_TO_PAUSE } from "./components/TutorialModal/constants";
import SwipeUpAnimation from "./utils/swipeup.json";
import "./assets/styles/game.scss";

interface GameType {
  startEndAnimation: () => void;
  resetEndAnimation: () => void;
  imageLoaded: () => void;
}

const Game = ({ startEndAnimation, resetEndAnimation, imageLoaded }: GameType) => {
  const frameCount = 360;
  const images = useRef<HTMLImageElement[]>([]);
  const currentIndex = useRef(1);
  const allowScroll = useRef(false);
  const scrollTimeout = useRef<gsap.core.Tween | null>(null);
  const observer = useRef<Observer | null>(null);
  const scrollTrigger = useRef<ScrollTrigger | null>(null);
  const [isTutorialModalOpen, setIsTutorialModalOpen] = useState(false);
  const isScrollable = useRef(true);
  const { width, height } = useResize();
  const { isScrolling, handleScroll } = useScroll();
  // Get path to images, so it can be dynamically imported.
  const imageContext = require.context("./assets/game-image-sequence/", true, /\.png$/);

  const checkImagesLoaded = () => {
    const hasImagesLoaded = images.current.every((image) => {
      return image.complete;
    });

    if (hasImagesLoaded) {
      imageLoaded();
    }

    return hasImagesLoaded;
  };

  const getCurrentFrame = (position: number): string => {
    return `./anim${String(position + 1).padStart(4, "0")}.png`;
  };

  const handleImageLoading = () => {
    const interval = setInterval(() => {
      const hasImagesLoaded = checkImagesLoaded();

      if (hasImagesLoaded) {
        clearInterval(interval);
      }
    }, 1000);
  };

  const createImages = () => {
    if (images.current.length <= frameCount) {
      const tempImages: HTMLImageElement[] = [];
      for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.src = imageContext(getCurrentFrame(i));
        tempImages.push(img);
      }

      images.current.push(...tempImages);
      handleImageLoading();
    }
  };

  const drawImage = () => {
    const padding = String(currentIndex.current).padStart(4, "0");
    const image = images.current.find((image) => image.src.includes(`anim${padding}`));
    const canvas = document.querySelector("canvas") as HTMLCanvasElement;

    canvas.style.width = `100%`;
    canvas.style.height = `100%`;

    const context = canvas.getContext("2d") as CanvasRenderingContext2D;

    context.canvas.width = width;
    context.canvas.height = height;

    // Clear canvas screen
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the image on the canvas
    context.drawImage(image!, 0, 0, canvas.width, canvas.height);
  };

  const goToFrame = (isScrollingDown: boolean) => {
    currentIndex.current = isScrollingDown ? currentIndex.current + 1 : currentIndex.current - 1;
    const isAtBeginning = currentIndex.current < 2;
    const isAtEnd = currentIndex.current > frameCount - 2;

    if (isAtEnd || isAtBeginning) {
      observer.current?.disable();
      if (!isScrollingDown) {
        scrollTrigger.current?.scroll(scrollTrigger.current.start);
      } else {
        if (isAtEnd) {
          startEndAnimation();
        }

        scrollTrigger.current?.scroll(scrollTrigger.current.end);
      }
      return;
    }

    if (currentIndex.current === frameCount - 10) {
      resetEndAnimation();
    }

    allowScroll.current = false;
    scrollTimeout.current?.restart(true);

    let target = images.current[currentIndex.current];
    if (target) {
      gsap.to(target, {
        yPercent: isScrollingDown ? -100 : 0,
        duration: 0.75,
        onUpdate: drawImage,
      });

      handleScroll();
      const futureIndex = isScrollingDown ? currentIndex.current + 1 : currentIndex.current - 1;
      if (FRAME_TO_PAUSE.includes(futureIndex)) {
        pauseGame();

        // Auto-continue on desktop screens
        if (width > 1024) {
          setTimeout(() => {
            continueGame();
          }, 1000);
        }
      }
    }
  };

  const repositionBackToGame = () => {
    const isAtBeginning = currentIndex.current > 1;
    const isAtEnd = currentIndex.current < frameCount - 1;
    if (isAtBeginning && isAtEnd && (isTutorialModalOpen || !isScrolling)) {
      observer.current?.disable();
      setTimeout(() => {
        goToGame();
        if (!isTutorialModalOpen) {
          observer.current?.enable();
        }
      }, 1000);
    }
  };

  const pauseGame = () => {
    isScrollable.current = false;
    // Open tutorial modal
    setIsTutorialModalOpen(true);
    observer.current?.disable();
  };

  const continueGame = () => {
    if (width <= 1024) {
      goToGame();
      const tutorialModal = document.querySelector(".tutorial-modal") as HTMLElement;
      tutorialModal.style.position = "absolute";
      const mainEl = document.querySelector("main") as HTMLElement;
      mainEl.style.overflow = "initial";
      // Close tutorial modal
      setIsTutorialModalOpen(false);
    }

    isScrollable.current = true;
    observer.current?.enable();
  };

  const preventScroll = useCallback((e: Event) => {
    const el = e.target as HTMLElement;

    console.log(isTutorialModalOpen, currentIndex.current, isScrollable.current);
    if (!isScrollable.current) {
      if (el.tagName.toLowerCase() !== "code") {
        e.preventDefault();
        e.stopPropagation();
      }

      if (el.tagName.toLowerCase() !== "canvas") {
        goToGame();
      }
    } else {
      setIsTutorialModalOpen(false);
    }
  }, []);

  const preventKeyboardScroll = useCallback((e: KeyboardEvent) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      e.stopPropagation();

      window.setTimeout(() => {
        setIsTutorialModalOpen(true);
        observer.current?.disable();
      }, 1000);

      return false;
    }
  }, []);

  const onObserverEnable = (self: any) => {
    allowScroll.current = false;
    scrollTimeout.current?.restart(true);
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const gameEl = document.querySelector(".game") as HTMLElement;
    const gameElScrollTop = gameEl.getBoundingClientRect().top;
    let savedScroll = gameElScrollTop + scrollTop;
    self._restoreScroll = () => {
      self.scrollY(savedScroll);
    };
    // When native scroll repositions, force it back to saved position
    document.addEventListener("scroll", self._restoreScroll, { passive: false });
  };

  const goToGame = () => {
    gsap.to(window, { scrollTo: { y: ".game", offsetY: 0 } });
  };

  const handleAnimationComplete = () => {
    if (width <= 1024) {
      const tutorialModal = document.querySelector(".tutorial-modal") as HTMLElement;
      tutorialModal.style.position = "fixed";
      tutorialModal.style.top = "-" + window.innerHeight + "px";
      tutorialModal.style.height = window.innerHeight + "px";
      const mainEl = document.querySelector("main") as HTMLElement;
      mainEl.style.overflow = "hidden";
    }
  };

  useEffect(() => {
    createImages();
    // eslint-disable-next-line
  }, []);

  // Move through frames when - animation timeline is available.
  useLayoutEffect(() => {
    scrollTimeout.current = gsap.delayedCall(0.00001, () => (allowScroll.current = true)).pause();

    observer.current = ScrollTrigger.observe({
      wheelSpeed: -1,
      type: "wheel,touch",
      onUp: () => {
        if (currentIndex.current < frameCount - 1 && isScrollable.current) {
          allowScroll.current && goToFrame(true);
        }
      },
      onDown: () => {
        if (currentIndex.current > 1 && isScrollable.current) {
          allowScroll.current && goToFrame(false);
        }
      },
      tolerance: 5,
      preventDefault: true,
      onEnable(self: any) {
        onObserverEnable(self);
      },
      onDisable: (self: any) => document.removeEventListener("scroll", self._restoreScroll),
    });

    observer.current.disable();

    scrollTrigger.current = ScrollTrigger.create({
      trigger: ".game",
      pin: true,
      start: "top top",
      end: "+=100",
      onEnter: (self) => {
        if (observer.current?.isEnabled) {
          return;
        }
        self.scroll(self.start + 1);
        observer.current?.enable();
      },
      onEnterBack: (self) => {
        if (observer.current?.isEnabled) {
          return;
        }
        self.scroll(self.end - 1);
        observer.current?.enable();
      },
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const image = images.current[currentIndex.current];

    if (image) {
      // Set image on load event to draw an image.
      if (!image.onload) image.onload = () => drawImage();
      // On resize reposition game screen.
      repositionBackToGame();
    }
    // eslint-disable-next-line
  }, [width, height]);

  useEffect(() => {
    const main = document.querySelector("main") as HTMLElement;

    main.addEventListener("wheel", preventScroll, { passive: false });
    main.addEventListener("touchmove", preventScroll, { passive: false });
    document.addEventListener("keydown", preventKeyboardScroll, { passive: false });

    return () => {
      main.removeEventListener("wheel", preventScroll);
      main.removeEventListener("touchmove", preventScroll);
      document.removeEventListener("keydown", preventKeyboardScroll);
    };
  }, [preventScroll, preventKeyboardScroll]);

  return (
    <section className="game">
      <canvas></canvas>
      {currentIndex.current > 0 && currentIndex.current < frameCount - 1 && !isScrolling && isScrollable.current && !isTutorialModalOpen ? (
        <Lottie className="swipe-up" animationData={SwipeUpAnimation} loop={true} />
      ) : (
        <></>
      )}
      {isTutorialModalOpen ? (
        <TutorialModal topicIndex={currentIndex.current} onContinue={continueGame} onCompleted={handleAnimationComplete} />
      ) : (
        <></>
      )}
    </section>
  );
};

export default Game;
