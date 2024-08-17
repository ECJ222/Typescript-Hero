import { useEffect } from 'react'
import sanitizeHtml from 'sanitize-html'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import { LESSONS, FRAME_TO_PAUSE } from '../../utils/constants'
import './lesson.scss'

interface LessonProps {
  topicIndex: number
  onContinue: () => void
}

export const Lesson = ({ topicIndex, onContinue }: LessonProps) => {
  const framePauseIndex: number = FRAME_TO_PAUSE.findIndex((index) => index === topicIndex + 1 || index === topicIndex - 1)
  const content = Object.entries(LESSONS)

  const getContent = () => {
    const [topic, body] = content[framePauseIndex]
    const sanitizedBody = sanitizeHtml(body)

    return {
      topic,
      sanitizedBody
    }
  }

  useEffect(() => {
    hljs.highlightAll()
  }, [topicIndex])

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
  )
}
