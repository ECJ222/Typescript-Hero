import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import Loader from "./components/Loader";
import Header from "./components/Header";
import Intro from "./components/Intro";
import Game from "./Game";
import End from "./End";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

function App() {
  const [isEndAnimationPlaying, setIsEndAnimationPlaying] = useState(false);
  const [isImageLoaded, setImagesLoading] = useState(true);

  const startEndAnimation = () => {
    setIsEndAnimationPlaying(true);
  };

  const resetEndAnimation = () => {
    setIsEndAnimationPlaying(false);
  };

  const handleLoading = () => {
    setImagesLoading(false);
  };

  useEffect(() => {
    ScrollTrigger.clearScrollMemory();
    window.history.scrollRestoration = "manual";
    const homeEl = document.querySelector(".home") as HTMLElement;
    homeEl.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      {isImageLoaded ? <Loader /> : <></>}
      <main className={isImageLoaded ? "overflow-hidden" : ""}>
        <section className="home">
          <Header />
          <Intro />
        </section>
        <Game startEndAnimation={startEndAnimation} resetEndAnimation={resetEndAnimation} imageLoaded={handleLoading} />
        <End startAnimation={isEndAnimationPlaying} />
      </main>
    </>
  );
}

export default App;
