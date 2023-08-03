import { useEffect, useState } from "react";
import { ReactLenis } from "@studio-freight/react-lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Header from "./components/Header";
import Intro from "./components/Intro";
import Game from "./Game";
import End from "./End";

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [isEndAnimationPlaying, setIsEndAnimationPlaying] = useState(false);

  const startEndAnimation = () => {
    setIsEndAnimationPlaying(true);
  };

  const resetEndAnimation = () => {
    setIsEndAnimationPlaying(false);
  };

  useEffect(() => {
    ScrollTrigger.clearScrollMemory();
    window.history.scrollRestoration = "manual";
    const homeEl = document.querySelector(".home") as HTMLElement;
    homeEl.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <ReactLenis root>
      <section className="home">
        <Header />
        <Intro />
      </section>
      <Game startEndAnimation={startEndAnimation} resetEndAnimation={resetEndAnimation} />
      <End startAnimation={isEndAnimationPlaying} />
    </ReactLenis>
  );
}

export default App;
