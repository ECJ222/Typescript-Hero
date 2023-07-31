import { useEffect } from "react";
import { ReactLenis } from "@studio-freight/react-lenis";
import Header from "./components/Header";
import Intro from "./components/Intro";
import Game from "./Game";

function App() {
  useEffect(() => {
    // ScrollTrigger.clearScrollMemory();
    window.history.scrollRestoration = "manual";
  }, []);

  return (
    <ReactLenis root>
      <section className="home">
        <Header />
        <Intro />
      </section>
      <Game />
    </ReactLenis>
  );
}

export default App;
