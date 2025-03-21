import { useState } from "react";
import { useTheme } from "../modules/theme";
import { useToggleTheme } from "../modules/theme";

export const SampleTheme = () => {
  const [test, setTest] = useState(0);
  const toggleTheme = useToggleTheme();
  console.log("aa");
  return (
    <div>
      <Comp />
      <div>asdqwd</div>
      <button onClick={() => setTest((prev) => ++prev)}>up</button>
      <button onClick={() => toggleTheme()}>toggle theme</button>
    </div>
  );
};

const Comp = () => {
  // const theme = useTheme();
  // console.log(theme);
  console.log("compt");
  return <div></div>;
};
