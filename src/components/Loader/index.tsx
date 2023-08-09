import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import BuildingIcon from "../BuildingIcon";
import "./Loader.scss";

const Loader = () => {
  const timeline = useRef<gsap.core.Timeline>(gsap.timeline({ repeat: -1, repeatDelay: 1 }));

  useEffect(() => {
    const targets = gsap.utils.toArray(".loader svg path");

    timeline.current.to(targets, {
      opacity: 1,
      duration: 1,
      stagger: 0.05,
    });
  }, []);

  return (
    <div className="loader">
      <BuildingIcon />
    </div>
  );
};

export default Loader;
