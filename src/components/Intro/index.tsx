// import Morph from "../Morph/Morph";
import { useLenis } from "@studio-freight/react-lenis";
import "./Intro.scss";

const Intro = () => {
  const lenis = useLenis();

  const handleClick = () => {
    lenis.scrollTo(".game");
  };

  return (
    <div className="intro">
      <div className="intro__cta">
        <span className="intro__text">Navigate This TypeScript Terrain with Our Feathered Friend.</span>

        <button className="intro__btn" onClick={handleClick}>
          Start
        </button>
      </div>
      {/* 3D Bird Image */}

      {/* <div className="shape-outer">
        <Morph />
      </div> */}
    </div>
  );
};

export default Intro;
