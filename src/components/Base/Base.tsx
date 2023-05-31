import { ComponentType } from "react";

const Base = ({ Header, Intro }: BaseProps) => {
  return (
    <>
      <Header />
      <Intro />
    </>
  );
};

type BaseProps = {
  Header: ComponentType;
  Intro: ComponentType;
};

export default Base;
