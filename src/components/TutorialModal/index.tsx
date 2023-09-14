import { useCallback, useEffect } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import { gsap } from "gsap";
import { useResize } from "../../hooks";
import { POSITIONS, FRAME_TO_PAUSE } from "./constants";
import { LESSONS } from "../../utils/lessons";
import "./TutorialModal.scss";

interface TutorialModalType {
  topicIndex: number;
}

const TutorialModal = ({ topicIndex }: TutorialModalType) => {
  const framePauseIndex: number = FRAME_TO_PAUSE.findIndex((index) => index === topicIndex + 1 || index === topicIndex - 1);
  const content = Object.entries(LESSONS);
  const { width } = useResize();

  const showModal = useCallback(() => {
    const isMobile = width < 1024;

    if (!isMobile) {
      gsap.from(".tutorial-modal", {
        width: "0px",
      });

      gsap.to(".tutorial-modal", {
        width: "175px",
      });

      gsap.to(".tutorial-modal", {
        width: "max-content",
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

  const getContent = () => {
    const topic = content[framePauseIndex]?.[0];
    const body = content[framePauseIndex]?.[1];

    return {
      topic,
      body,
    };
  };

  useEffect(() => {
    showModal();
  }, [showModal]);

  useEffect(() => {
    hljs.highlightAll();
  }, [topicIndex]);

  return (
    <div className="tutorial-modal">
      <h3 className="tutorial-modal__topic">{getContent().topic}</h3>
      <pre>
        <code className="language-typescript">{getContent().body}</code>
      </pre>
    </div>
  );
};

export default TutorialModal;
