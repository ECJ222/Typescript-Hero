import { ComponentType } from "react";

const Base = ({ Header }: BaseProps) => {
  return <Header />;
};

type BaseProps = {
  Header: ComponentType;
};

export default Base;
