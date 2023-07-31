import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

interface GSAPContext {
  callback: () => void;
}

export const useGsapContext = ({ callback }: GSAPContext) => {
  let ctx = useRef<gsap.Context | null>(null);

  useLayoutEffect(() => {
    ctx.current = gsap.context(() => callback());

    return () => {
      ctx?.current?.revert();
    };
    // eslint-disable-next-line
  }, []);

  return ctx.current;
};
