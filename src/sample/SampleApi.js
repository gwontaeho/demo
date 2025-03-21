import { useEffect } from "react";
import { api } from "../modules/api";

export const SampleApi = () => {
  useEffect(() => {
    test();
  }, []);

  console.log(api);

  const test = async () => {
    try {
      const res = await fetch("http://localhost:3001");
      const te = await api.get("http://localhost:3001");
      console.log(te);
      console.log(await res.text());
    } catch (error) {
      console.log(error);
    }
  };

  return <div></div>;
};
