import "./Intro.scss";

const Intro = () => {
  const handleClick = () => {
    const gameEl = document.querySelector(".game") as HTMLElement;
    gameEl.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="intro">
      <div className="intro__cta">
        <span className="intro__text">Navigate This TypeScript Terrain with Our Feathered Friend.</span>

        <button className="intro__btn" onClick={handleClick}>
          Start
        </button>
      </div>
    </div>
  );
};

export default Intro;
