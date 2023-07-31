import { useEffect, useCallback } from "react";
import anime from "animejs/lib/anime.es.js";

export const useAnime = (target: string, routeTarget: string, duration: number) => {
  const addAnim = useCallback(
    () => async () => {
      const from = 0;
      const to = -100;
      const targets = document.querySelector(target) as HTMLElement;
      targets.style.transform = `translateY(${from}%)`;

      const translateY = `${to}%`;
      const anim = anime.timeline({
        easing: "easeInOutSine",
        duration,
      });
      anim.add({
        targets,
        translateY,
      });
    },
    [duration, target]
  );

  const addSvgAnim = useCallback(() => {
    const shape = document.querySelector(".shape") as HTMLElement;
    const path = document.querySelector(".shape path") as SVGPathElement;

    // shape animation
    anime({
      targets: shape,
      scaleY: [
        {
          value: [1.5, 2],
          duration: duration * 0.5,
          easing: "easeInQuad",
        },
        {
          value: 1.5,
          duration: duration * 0.5,
          easing: "easeOutQuad",
        },
      ],
    });

    anime({
      targets: path,
      duration,
      easing: "easeOutQuad",
      d: path.getAttribute("data-pathid"),
    });
  }, [duration]);

  useEffect(() => {
    addAnim()();
    addSvgAnim();
  }, [addAnim, addSvgAnim]);
};
