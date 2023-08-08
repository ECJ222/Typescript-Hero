import { useCallback, useEffect, useRef, useState } from "react";
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
}

const Game = ({ startEndAnimation, resetEndAnimation }: GameType) => {
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
  const imageContext = require.context("./assets/game-image-sequence/", true, /\.png$/);
  const pagination = 30;

  const getCurrentFrame = (position: number): string => {
    return `./anim${String(position + 1).padStart(4, "0")}.png`;
  };

  const createImages = () => {
    if (images.current.length < frameCount) {
      const tempImages: HTMLImageElement[] = [];
      for (let i = images.current.length; i < images.current.length + pagination; i++) {
        const img = new Image();
        img.src = imageContext(getCurrentFrame(i));
        tempImages.push(img);
      }

      images.current.push(...tempImages);
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

    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the image on the canvas
    context.drawImage(image!, 0, 0, canvas.width, canvas.height);

    if (!images.current[currentIndex.current + pagination] && images.current.length < frameCount) {
      createImages();
    }
  };

  const continueGame = () => {
    isScrollable.current = true;
    window.setTimeout(() => {
      setIsTutorialModalOpen(false);
      observer.current?.enable();
    }, 1000);
  };

  const preventScroll = useCallback((e: Event) => {
    if (!isScrollable.current) {
      e.preventDefault();
      e.stopPropagation();

      window.setTimeout(() => {
        setIsTutorialModalOpen(true);
        observer.current?.disable();
      }, 1000);

      return false;
    }
  }, []);

  const preventKeyboardScroll = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        preventScroll(e);
      }
    },
    [preventScroll]
  );

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
        isScrollable.current = false;
        return;
      }
    }
  };

  useEffect(() => {
    createImages();
    // eslint-disable-next-line
  }, []);

  // Move through frames when - animation timeline is available.
  useEffect(() => {
    scrollTimeout.current = gsap.delayedCall(0.00001, () => (allowScroll.current = true)).pause();

    observer.current = ScrollTrigger.observe({
      type: "wheel,touch",
      onUp: () => {
        if (currentIndex.current > 1) {
          allowScroll.current && goToFrame(false);
        }
      },
      onDown: () => {
        if (currentIndex.current < frameCount - 1) {
          allowScroll.current && goToFrame(true);
        }
      },
      tolerance: 5,
      preventDefault: true,
      onEnable(self: any) {
        allowScroll.current = false;
        scrollTimeout.current?.restart(true);
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const gameEl = document.querySelector(".game") as HTMLElement;
        const gameElScrollTop = gameEl.getBoundingClientRect().top;
        let savedScroll = gameElScrollTop + scrollTop;
        // when native scroll repositions, force it back to saved position
        self._restoreScroll = () => {
          // if (currentIndex.current > 1 && (isTutorialModalOpen || !isScrolling)) {
          //   gsap.to(window, { scrollTo: { y: ".game", offsetY: 0 } });
          // } else {
          self.scrollY(savedScroll);
          // }
        };

        document.addEventListener("scroll", self._restoreScroll, { passive: false });
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
        // self.scroll(self.start + 1);
        observer.current?.enable();
      },
      onEnterBack: (self) => {
        if (observer.current?.isEnabled) {
          return;
        }
        // self.scroll(self.end - 1);
        observer.current?.enable();
      },
    });
    // eslint-disable-next-line
  }, []);

  // In case of resize event - image load
  useEffect(() => {
    const image = images.current[currentIndex.current];

    if (image) {
      if (!image.onload) image.onload = () => drawImage();
      const isAtBeginning = currentIndex.current > 1;
      const isAtEnd = currentIndex.current < frameCount - 1;
      if (isAtBeginning && isAtEnd && (isTutorialModalOpen || !isScrolling)) {
        observer.current?.disable();
        setTimeout(() => {
          gsap.to(window, { scrollTo: { y: ".game", offsetY: 0 } });
          observer.current?.enable();
        }, 1000);
      }
    }
    // eslint-disable-next-line
  }, [width, height]);

  useEffect(() => {
    const root = document.querySelector("#root") as HTMLElement;

    root.addEventListener("scroll", preventScroll, { passive: false });
    root.addEventListener("wheel", preventScroll, { passive: false });

    document.addEventListener("keydown", preventKeyboardScroll, { passive: false });

    return () => {
      root.removeEventListener("scroll", preventScroll);
      root.removeEventListener("wheel", preventScroll);
      document.removeEventListener("keydown", preventKeyboardScroll);
    };
  }, [preventScroll, preventKeyboardScroll]);

  return (
    <section className="game">
      <canvas></canvas>
      {currentIndex.current > 0 && currentIndex.current < frameCount - 1 && !isScrolling && isScrollable.current ? (
        <Lottie className="swipe-up" animationData={SwipeUpAnimation} loop={true} />
      ) : (
        <></>
      )}
      {isTutorialModalOpen ? <TutorialModal topicIndex={currentIndex.current} onContinue={continueGame} /> : <></>}
    </section>
  );
};

export default Game;
