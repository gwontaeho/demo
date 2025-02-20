import { useEffect, useRef, useState, useReducer } from "react";

const cloneDeep = (item) => {
  if (item === null || typeof item !== "object") {
    return item;
  }
  if (Array.isArray(item)) {
    return item.map(cloneDeep);
  }
  const obj = {};
  for (let key in item) {
    if (item.hasOwnProperty(key)) {
      obj[key] = cloneDeep(item[key]);
    }
  }
  return obj;
};

const useData = (source, config) => {
  const forceUpdate = useReducer(() => ({}))[1];

  const { setSource, fetchData, getData } = useRef(
    new (class {
      #status = "pending";
      #data = null;
      #source = null;
      #render = forceUpdate;

      setSource = (source) => {
        this.#source = source;
      };
      fetchData = () => {
        this.#source?.();
      };
      getData = () => {
        return cloneDeep(this.#data);
      };
    })()
  ).current;

  setSource(source);

  useEffect(() => {
    console.log("aa");
  }, []);

  const data = getData();

  return { data, fetchData };
};

export { useData };
