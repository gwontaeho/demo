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

const useFetch = (source, config = {}) => {
  const forceUpdate = useReducer(() => ({}))[1];

  const [data, setData] = useState(null);

  const _ = useRef({}).current;

  const methods = useRef({
    refetch: () => {},
  }).current;

  const { setSource, setConfig, fetchData, fetchDataWithKey, getData } = useRef(
    new (class {
      #key = null;
      #data = null;
      #source = null;
      #config = null;
      #render = forceUpdate;
      setSource = (source) => {
        this.#source = source;
      };
      setConfig = (config) => {
        this.#config = config;
      };
      fetchData = async () => {
        try {
          this.#data = await this.#source?.();
          this.#render?.();
          this.#config.onSuccess?.();
        } catch (error) {
          this.#config.onError?.();
        }
      };
      fetchDataWithKey = async (key) => {
        const stringified = JSON.stringify(key);
        if (this.#key === stringified) return;
        this.#key = stringified;
        try {
          this.#data = await this.#source?.();
          this.#render?.();
          this.#config.onSuccess?.();
        } catch (error) {
          this.#config.onError?.();
        }
      };
      getData = () => {
        return cloneDeep(this.#data);
      };
      startInterval = () => {};
    })()
  ).current;
  setSource(source);
  setConfig(config);

  const key = Array.isArray(config.key) ? config.key : [config.key];
  const enabled = config.enabled ?? true;
  const timeout = config.timeout;
  const interval = config.interval;

  useEffect(() => {}, []);

  useEffect(() => {
    if (enabled) {
      fetchDataWithKey(key);
    }
  }, [enabled, ...key]);

  return { data, fetchData };
};

export { useFetch };
