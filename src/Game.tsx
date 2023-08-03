import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Observer } from "gsap/Observer";
import Lottie from "lottie-react";
import { useResize, useGsapContext, useScroll } from "./hooks";
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
  const [images, setImage] = useState<HTMLImageElement[]>([]);
  const currentIndex = useRef(0);
  const allowScroll = useRef(false);
  const scrollTimeout = useRef<gsap.core.Tween | null>(null);
  const observer = useRef<Observer | null>(null);
  const scrollTrigger = useRef<ScrollTrigger | null>(null);
  const [isTutorialModalOpen, setIsTutorialModalOpen] = useState(false);
  const isScrollable = useRef(true);
  const { width, height } = useResize();
  const { isScrolling, handleScroll } = useScroll();
  const imageContext = require.context("./assets/game-image-sequence/", true, /\.png$/);

  const getCurrentFrame = (position: number): string => {
    return `./anim${String(position + 1).padStart(4, "0")}.png`;
  };

  const setImages = () => {
    if (images.length < frameCount) {
      const tempImages: HTMLImageElement[] = [];
      for (let i = 0; i < frameCount; i++) {
        const img = new Image();

        img.src = imageContext(getCurrentFrame(i));
        tempImages.push(img);
      }

      setImage([...images, ...tempImages]);
    }
  };

  const drawImage = useCallback(() => {
    const image = images[currentIndex.current];
    const canvas = document.querySelector("canvas") as HTMLCanvasElement;

    canvas.style.width = `100%`;
    canvas.style.height = `100%`;

    const context = canvas.getContext("2d") as CanvasRenderingContext2D;

    context.canvas.width = width;
    context.canvas.height = height;

    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the image on the canvas
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
  }, [height, images, width]);

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

  const setImageLoad = useCallback(() => {
    images[currentIndex.current].onload = () => drawImage();
  }, [drawImage, images]);

  const goToFrame = (isScrollingDown: boolean) => {
    currentIndex.current = isScrollingDown ? currentIndex.current + 1 : currentIndex.current - 1;
    const isAtEnd = currentIndex.current === images.length - 1;
    const isAtBeginning = currentIndex.current === 0;
    if (isAtEnd || isAtBeginning) {
      // resume native scroll
      observer.current?.disable();
      if (isAtBeginning) {
        const homeEl = document.querySelector(".home");
        homeEl?.scrollIntoView({ behavior: "smooth" });
      }
      if (isAtEnd) {
        startEndAnimation();
        const endEl = document.querySelector(".end");
        endEl?.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }

    if (isAtEnd || currentIndex.current > images.length - 5) {
      if (!isScrollingDown) {
        resetEndAnimation();
      }
    }

    allowScroll.current = false;
    scrollTimeout.current?.restart(true);

    let target = images[currentIndex.current];
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

  setImages();
  useGsapContext({ callback: setImageLoad });

  // Move through frames when - animation timeline is available.
  useEffect(() => {
    scrollTimeout.current = gsap.delayedCall(0.00001, () => (allowScroll.current = true)).pause();

    observer.current = ScrollTrigger.observe({
      type: "wheel,touch",
      onUp: () => {
        if (currentIndex.current > 0) {
          allowScroll.current && goToFrame(false);
        }
      },
      onDown: () => {
        if (currentIndex.current < frameCount - 1) {
          allowScroll.current && goToFrame(true);
        }
      },
      tolerance: 10,
      preventDefault: true,
      onEnable(self: any) {
        allowScroll.current = false;
        scrollTimeout.current?.restart(true);
        let savedScroll = self.scrollY();
        // when native scroll repositions, force it back to saved position
        self._restoreScroll = () => self.scrollY(savedScroll);
        document.addEventListener("scroll", self._restoreScroll, { passive: false });
      },
      onDisable: (self: any) => document.removeEventListener("scroll", self._restoreScroll),
    });

    observer.current.disable();

    scrollTrigger.current = ScrollTrigger.create({
      trigger: ".game",
      pin: true,
      start: "top top",
      end: "+=10",
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

  // In case of resize event - image load
  useEffect(() => {
    const isImageLoaded = images[currentIndex.current].complete;

    if (isImageLoaded) {
      drawImage();
      scrollTrigger.current?.refresh();
    }
    // eslint-disable-next-line
  }, [width, height]);

  useEffect(() => {
    const root = document.querySelector("#root") as HTMLElement;

    root.addEventListener("wheel", preventScroll, { passive: false });

    return () => root.removeEventListener("wheel", preventScroll);
  }, [preventScroll]);

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
