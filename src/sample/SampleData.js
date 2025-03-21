import { useState } from "react";
import { useFetch } from "../modules/fetch";

export const SampleData = () => {
  const [test, setTest] = useState(0);

  const mockApi = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(["a"]);
      }, 2000);
    });
  };

  const { data, fetchData } = useFetch(mockApi, {
    interval: 0,
    timeout: 2000,
    // key: ["asd", "wfwf"],
    // enabled: test === 3,
    onSuccess: () => {
      console.log("asd");
    },
    onError: () => {},
  });

  console.log(data);

  return (
    <div>
      <button onClick={() => setTest((prev) => ++prev)}>gogo</button>
      <div>asdasd</div>
    </div>
  );
};
