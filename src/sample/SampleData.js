import { useState } from "react";
import { useData } from "../modules/data";

export const SampleData = () => {
  const [test, setTest] = useState(0);

  const mockApi = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(["a"]);
      }, 2000);
    });
  };

  const {} = useData(mockApi, {
    interval: 0,
    timeout: 2000,
    deps: [],
    onSuccess: () => {},
    onError: () => {},
  });

  return (
    <div>
      <button onClick={() => setTest((prev) => ++prev)}>gogo</button>
      <div>asdasd</div>
    </div>
  );
};
