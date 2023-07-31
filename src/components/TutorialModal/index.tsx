import { useCallback, useRef } from "react";
import { gsap } from "gsap";
import { useResize, useGsapContext } from "../../hooks";
import { POSITIONS } from "./constants";
import lessons from "../../utils/lessons.json";
import "./TutorialModal.scss";

interface TutorialModalType {
  topicIndex: number;
  onContinue: () => void;
}

const TutorialModal = ({ topicIndex, onContinue }: TutorialModalType) => {
  const content = Object.entries(lessons);
  const modal = useRef<HTMLDivElement | null>(null);
  const { width } = useResize();

  const initGSAP = useCallback(() => {
    const isMobile = width < 768;

    if (!isMobile) {
      gsap.from(".tutorial-modal", {
        width: "0px",
      });

      gsap.to(".tutorial-modal", {
        width: "145px",
      });

      gsap.to(".tutorial-modal", {
        width: "290px",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        // ...POSITIONS[topicIndex],
      });
    }
  }, [width]);

  const handleClick = () => {
    onContinue();
  };

  useGsapContext({ callback: initGSAP });

  return (
    <div className="tutorial-modal" ref={modal}>
      <h3 className="tutorial-modal__topic">{content[topicIndex][0]}</h3>
      <pre>
        <code className="language-typescript">{content[topicIndex][1]}</code>
      </pre>
      <button className="tutorial-modal__topic-continue-btn" onClick={handleClick}>
        Continue
      </button>
    </div>
  );
};

export default TutorialModal;
