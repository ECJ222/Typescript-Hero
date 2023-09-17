import { gsap } from "gsap";
import "./Intro.scss";

const Intro = () => {
  const handleClick = () => {
    gsap.to(window, { scrollTo: ".game" });
  };

  return (
    <div className="intro">
      <div className="intro__cta">
        <span className="intro__text">Navigate This Typescript Terrain with Our Feathered Friend.</span>

        <button className="intro__btn" onClick={handleClick}>
          Start
        </button>
      </div>
    </div>
  );
};

export default Intro;
