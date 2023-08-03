interface POSITION {
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  transform?: string;
}

const POSITIONX = "5%";
const POSITIONY = "5%";
const POSITION_CENTER = "50%";

export const FRAME_TO_PAUSE = [36, 72, 108, 144, 180, 216, 252, 288, 302];

export const POSITIONS: POSITION[] = [
  {
    top: POSITIONY,
    left: POSITIONX,
  },
  {
    top: POSITIONY,
    right: POSITIONX,
  },
  {
    bottom: POSITIONY,
    left: POSITIONX,
  },
  {
    bottom: POSITIONY,
    right: POSITIONX,
  },
  {
    top: POSITION_CENTER,
    left: POSITION_CENTER,
    transform: "translate(-50%, -50%)",
  },
  {
    bottom: POSITIONX,
    left: POSITION_CENTER,
    transform: "translateX(-50%)",
  },
  {
    top: POSITIONY,
    right: POSITIONX,
  },
  {
    bottom: POSITIONY,
    left: POSITIONX,
  },
  {
    top: POSITIONY,
    left: POSITIONX,
  },
];
