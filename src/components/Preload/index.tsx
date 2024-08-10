import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { clsx } from 'clsx';
import './preload.scss';

interface PreloadProps {
  fullScreen?: boolean;
  start?: boolean;
  infinite?: boolean;
}

export const Preload = ({ fullScreen = true, start = false, infinite = true }: PreloadProps) => {
  const timeline = useRef<gsap.core.Timeline>();

  useEffect(() => {
    if (infinite) {
      timeline.current = gsap.timeline({ repeat: -1, repeatDelay: 1 });
    } else {
      timeline.current = gsap.timeline();
    }

    const targets = gsap.utils.toArray('.preload svg path');
    if (start || infinite) {
      timeline.current.to(targets, {
        opacity: 1,
        duration: 1,
        stagger: 0.05
      });
    }

    return () => {
      timeline.current?.kill();
    };
  }, [start]);

  return (
    <div className={clsx({ preload: true, 'preload--full-screen': fullScreen })}>
      <div className="preload__icon">
        <svg preserveAspectRatio="xMidYMid meet" viewBox="0 0 662 317" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M397 1L265 1V317H397V1Z" stroke="white" />
          <path d="M265 79.5094L133 79.5094V317H265V79.5094Z" stroke="white" />
          <path d="M133 190.404H1L1 317H133V190.404Z" stroke="white" />
          <path d="M117.167 289.061H99.957V308.329H117.167V289.061Z" stroke="white" />
          <path d="M661 190.404H529V317H661V190.404Z" stroke="white" />
          <path d="M34.5593 253.415H17.3494V272.683H34.5593V253.415Z" stroke="white" />
          <path d="M117.167 208.134H99.957V227.402H117.167V208.134Z" stroke="white" />
          <path d="M165.355 102.159H148.145V121.427H165.355V102.159Z" stroke="white" />
          <path d="M243.66 134.915H226.45V154.183H243.66V134.915Z" stroke="white" />
          <path d="M294.429 25.0854H277.219V44.3537H294.429V25.0854Z" stroke="white" />
          <path d="M294.429 25.0854H277.219V44.3537H294.429V25.0854Z" stroke="white" />
          <path d="M387.362 25.0854H370.153V44.3537H387.362V25.0854Z" stroke="white" />
          <path d="M387.362 134.915H370.153V154.183H387.362V134.915Z" stroke="white" />
          <path d="M426.945 106.012H409.735V125.281H426.945V106.012Z" stroke="white" />
          <path d="M426.945 179.232H409.735V198.5H426.945V179.232Z" stroke="white" />
          <path d="M426.945 263.049H409.735V282.317H426.945V263.049Z" stroke="white" />
          <path d="M518.158 134.915H500.948V154.183H518.158V134.915Z" stroke="white" />
          <path d="M554.299 208.134H537.089V227.402H554.299V208.134Z" stroke="white" />
          <path d="M554.299 279.427H537.089V298.695H554.299V279.427Z" stroke="white" />
          <path d="M650.674 250.524H633.464V269.793H650.674V250.524Z" stroke="white" />
          <path d="M518.158 260.159H500.948V279.427H518.158V260.159Z" stroke="white" />
          <path d="M383.92 260.159H366.711V279.427H383.92V260.159Z" stroke="white" />
          <path d="M294.429 134.915H277.219V154.183H294.429V134.915Z" stroke="white" />
          <path d="M294.429 260.159H277.219V279.427H294.429V260.159Z" stroke="white" />
          <path d="M165.355 198.5H148.145V217.768H165.355V198.5Z" stroke="white" />
          <path d="M243.66 263.049H226.45V282.317H243.66V263.049Z" stroke="white" />
          <path d="M165.355 279.427H148.145V298.695H165.355V279.427Z" stroke="white" />
          <path d="M529 79.5094L397 79.5094V317H529V79.5094Z" stroke="white" />
        </svg>
      </div>
    </div>
  );
};
