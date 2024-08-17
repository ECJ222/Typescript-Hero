import { gsap } from 'gsap'

export const Intro = () => {
  const handleClick = () => {
    gsap.to(window, { scrollTo: '.screen__game' })
  }

  return (
    <div className="intro">
      <div className="intro__cta">
        <span className="intro__text">Navigate This Terrain with Our Feathered Friend Typpy.</span>

        <button className="intro__btn" onClick={handleClick}>
          Start
        </button>
      </div>
    </div>
  )
}
