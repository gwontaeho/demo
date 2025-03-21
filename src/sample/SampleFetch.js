import { useState } from "react";
import { useFetch } from "../modules/fetch";

export const SampleFetch = () => {
  const [test, setTest] = useState(0);

  const mockApi = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(["a", test]);
      }, 2000);
    });
  };

  const { data, fetchData } = useFetch({
    fetcher: mockApi,
    formatter: (data) => {
      console.log(data);
      return "1";
    },
    enabled: test % 3 === 0,
    // interval: 1000,
    timeout: 2000,
    key: test,
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
