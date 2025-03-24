import { useState } from "react";
import { useTheme } from "../module/theme";
import { useToggleTheme } from "../module/theme";

export const SampleTheme = () => {
  const [test, setTest] = useState(0);
  const toggleTheme = useToggleTheme();
  console.log("aa");
  return (
    <div>
      {test % 2 === 0 ? (
        <Comp test={test} name="aa" />
      ) : (
        <Comp test={test} name="bb" />
      )}
      <div>asdqwd</div>
      <button onClick={() => setTest((prev) => ++prev)}>up</button>
      <button onClick={() => toggleTheme()}>toggle theme</button>
    </div>
  );
};

const Comp = (props) => {
  const { test, name } = props;
  const [tt, setTt] = useState(name);
  console.log(tt);

  // const theme = useTheme();
  // console.log(theme);
  // console.log("compt");
  console.log(test);
  return <div>{test}</div>;
};
