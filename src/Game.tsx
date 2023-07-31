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

gsap.registerPlugin(ScrollTrigger, Observer);

const Game = () => {
  const frameCount = 360;
  const frameRef = useRef<number>(0);
  const [images, setImage] = useState<HTMLImageElement[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const observer = useRef<Observer | null>(null);
  const scrollTrigger = useRef<ScrollTrigger | null>(null);
  const timeline = useRef<gsap.core.Timeline>(
    gsap.timeline({
      paused: true,
      onReverseComplete: () => {
        // observer.current?.disable();
      },
      onComplete: () => {
        // observer.current?.disable();
        setIsAnimating(false);
      },
    })
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTutorialModalOpen, setIsTutorialModalOpen] = useState(false);
  const { width, height } = useResize();
  const { isScrolling } = useScroll();
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
    if (FRAME_TO_PAUSE.includes(frameRef.current)) {
      // setIsTutorialModalOpen(true);
      // ScrollTrigger.disable(false);
    }

    if (images[frameRef.current]) {
      const image = images[frameRef.current];
      const canvas = document.querySelector("canvas") as HTMLCanvasElement;

      canvas.style.width = `100%`;
      canvas.style.height = `${height}`;

      const context = canvas.getContext("2d") as CanvasRenderingContext2D;

      context.canvas.width = width;
      context.canvas.height = height;

      context.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the image on the canvas
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      setIsAnimating(false);
    } else {
      // Out of images game has ended.
      // observer.current?.disable();
    }
  }, [height, images, width]);

  const continueGame = () => {
    setIsTutorialModalOpen(false);
  };

  const setImageLoad = useCallback(() => {
    images[frameRef.current].onload = () => drawImage();
  }, [drawImage, images]);

  const goToPrevFrame = () => {
    setIsAnimating(true);
    frameRef.current -= 1;
    timeline.current.to(
      { frame: frameRef.current },
      {
        frame: frameCount - 1,
        snap: "frame",
        ease: "none",
        onUpdate: drawImage,
      }
    );
    setCurrentIndex(currentIndex - 1);
  };

  const goToNextFrame = () => {
    setIsAnimating(true);
    console.log(scrollTrigger.current?.end, document.documentElement.scrollTop);
    frameRef.current += 1;
    timeline.current.to(
      { frame: frameRef.current },
      {
        frame: frameCount - 1,
        snap: "frame",
        ease: "none",
        onUpdate: drawImage,
      }
    );
    setCurrentIndex(currentIndex + 1);
  };

  setImages();
  useGsapContext({ callback: setImageLoad });

  useEffect(() => {
    if (!isTutorialModalOpen) {
      // ScrollTrigger.enable();
    }
  }, [isTutorialModalOpen]);

  // Move through frames when - animation timeline is available.
  useEffect(() => {
    const observerOptions = {
      type: "wheel,touch",
      target: ".game",
      tolerance: 10,
      onUp: () => {
        timeline.current.play();
        goToPrevFrame();
      },
      onDown: () => {
        const scrollTriggerEnd = scrollTrigger.current?.end as number;
        const scrollDocumentProgress = Math.floor(document.documentElement.scrollTop);

        timeline.current.play();
        goToNextFrame();
      },
    };
    observer.current = Observer.create(observerOptions);

    observer.current.disable();

    const triggerOptions = {
      animation: timeline.current,
      trigger: ".game",
      start: "top top",
      end: "bottom",
      onEnter: () => {
        frameRef.current < 1 && observer.current?.enable();
      },
      onEnterBack: () => {
        frameRef.current > 0 && observer.current?.enable();
      },
      onLeave: () => observer.current?.disable(),
      onLeaveBack: () => observer.current?.disable(),
      markers: true,
      pin: true,
    };

    scrollTrigger.current = ScrollTrigger.create(triggerOptions);
    // eslint-disable-next-line
  }, []);

  // In case of resize event - image load
  useEffect(() => {
    const isImageLoaded = images[frameRef.current].complete;

    if (isImageLoaded) {
      drawImage();
    }
    // eslint-disable-next-line
  }, [width, height]);

  return (
    <section className="game">
      <canvas></canvas>
      {frameRef.current > 0 && !isScrolling && !isTutorialModalOpen ? (
        <Lottie className="swipe-up" animationData={SwipeUpAnimation} loop={true} />
      ) : (
        <></>
      )}
      {isTutorialModalOpen ? <TutorialModal topicIndex={0} onContinue={continueGame} /> : <></>}
    </section>
  );
};

export default Game;
