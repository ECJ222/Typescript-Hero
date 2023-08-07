import { useCallback, useEffect, useRef } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import { gsap } from "gsap";
import { useResize } from "../../hooks";
import { POSITIONS, FRAME_TO_PAUSE } from "./constants";
import { LESSONS } from "../../utils/lessons";
import "./TutorialModal.scss";

interface TutorialModalType {
  topicIndex: number;
  onContinue: () => void;
}

const TutorialModal = ({ topicIndex, onContinue }: TutorialModalType) => {
  const framePauseIndex: number = FRAME_TO_PAUSE.findIndex((index) => index === topicIndex + 1 || index === topicIndex - 1);
  const content = Object.entries(LESSONS);
  const modal = useRef<HTMLDivElement | null>(null);
  const { width } = useResize();

  const showModal = useCallback(() => {
    const isMobile = width < 768;

    if (!isMobile) {
      gsap.from(".tutorial-modal", {
        width: "0px",
      });

      gsap.to(".tutorial-modal", {
        width: "175px",
      });

      gsap.to(".tutorial-modal", {
        width: "350px",
        ...POSITIONS[framePauseIndex],
      });
    } else {
      gsap.from(".tutorial-modal", {
        width: "0px",
      });

      gsap.to(".tutorial-modal", {
        width: "100%",
        top: "0",
        left: "0",
      });
    }
  }, [framePauseIndex, width]);

  const handleClick = () => {
    onContinue();
  };

  useEffect(() => {
    showModal();
  }, [showModal]);

  useEffect(() => {
    hljs.highlightAll();
  }, [topicIndex]);

  return (
    <div className="tutorial-modal" ref={modal}>
      <h3 className="tutorial-modal__topic">{content[framePauseIndex][0]}</h3>
      <pre>
        <code className="language-typescript">{content[framePauseIndex][1]}</code>
      </pre>
      <button className="tutorial-modal__topic-continue-btn" onClick={handleClick}>
        Continue
      </button>
    </div>
  );
};

export default TutorialModal;
