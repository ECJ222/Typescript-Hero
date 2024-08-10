import { useCallback, useEffect } from 'react';
import sanitizeHtml from 'sanitize-html';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import { gsap } from 'gsap';
import { useResize } from '../../hooks';
import { LESSONS, POSITIONS, FRAME_TO_PAUSE } from '../../utils/constants';
import './lesson.scss';

interface LessonProps {
  topicIndex: number;
  onContinue: () => void;
  onCompleted: () => void;
}

export const Lesson = ({ topicIndex, onContinue, onCompleted }: LessonProps) => {
  const framePauseIndex: number = FRAME_TO_PAUSE.findIndex((index) => index === topicIndex + 1 || index === topicIndex - 1);
  const content = Object.entries(LESSONS);
  const { width } = useResize();

  const showModal = useCallback(() => {
    const isMobile = width < 1024;

    if (!isMobile) {
      gsap.from('.lesson', {
        width: '0px'
      });

      gsap.to('.lesson', {
        width: '175px'
      });

      gsap.to('.lesson', {
        width: '650px',
        ...POSITIONS[framePauseIndex]
      });
    } else {
      gsap.from('.lesson', {
        width: '0px'
      });

      gsap.to('.lesson', {
        width: '100%',
        top: '0',
        left: '0',
        onComplete: () => {
          onCompleted();
        }
      });
    }
  }, [framePauseIndex, width]);

  const getContent = () => {
    const [topic, body] = content[framePauseIndex];
    const sanitizedBody = sanitizeHtml(body);

    return {
      topic,
      sanitizedBody
    };
  };

  useEffect(() => {
    showModal();
  }, [showModal]);

  useEffect(() => {
    hljs.highlightAll();
  }, [topicIndex]);

  return (
    <div className="lesson">
      <h3 className="lesson__topic">{getContent().topic}</h3>
      <pre>
        <code className="language-typescript">{getContent().sanitizedBody}</code>
      </pre>
      <button className="lesson__continue-btn" onClick={onContinue}>
        Continue
      </button>
    </div>
  );
};
