import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import BuildingIcon from "./components/BuildingIcon";
import "./assets/styles/end.scss";

interface EndType {
  startAnimation: boolean;
}

const End = ({ startAnimation }: EndType) => {
  const timeline = useRef<gsap.core.Timeline>(gsap.timeline());

  useEffect(() => {
    const targets = gsap.utils.toArray(".end svg path");

    if (startAnimation) {
      timeline.current.to(targets, {
        opacity: 1,
        duration: 1,
        stagger: 0.05,
      });
    } else {
      timeline.current.to(targets, {
        opacity: 0,
        ease: "none",
      });
    }
  }, [startAnimation]);

  return (
    <section className="end">
      <BuildingIcon />
      <span className="text">Made with ✨ by Enoch Chejieh</span>
    </section>
  );
};

export default End;
