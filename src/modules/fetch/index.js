import {
  useEffect,
  useRef,
  useState,
  useReducer,
  useCallback,
  useMemo,
} from "react";

const cloneDeep = (item) => {
  if (item === null || typeof item !== "object") {
    return item;
  }
  if (Array.isArray(item)) {
    return item.map(cloneDeep);
  }
  const obj = {};
  for (const key in item) {
    if (item.hasOwnProperty(key)) {
      obj[key] = cloneDeep(item[key]);
    }
  }
  return obj;
};

const useFetch = (config = {}) => {
  const {
    fetcher,
    formatter,
    enabled,
    key,
    timeout,
    interval,
    onSuccess,
    onError,
  } = config;

  const _enabled = !!enabled;
  const _key = Array.isArray(key) ? key : [key];

  const [data, setData] = useState(null);

  const _ = useRef({
    key: [crypto.randomUUID()],
    data: null,
  }).current;

  const fetchData = useCallback(async () => {
    try {
      const response = await fetcher();
      const newData = formatter ? formatter(response) : response;
      return newData;
    } catch (error) {
      console.log(error);
    }
  }, [fetcher, formatter]);

  const _fetchData = useCallback(async () => {
    try {
      const newData = await fetchData();
      setData(newData);
      onSuccess();
    } catch (error) {
      console.log(error);
      onError();
    }
  }, [fetchData, onSuccess, onError, ..._key]);

  const isKeyEqual = useCallback((target) => {
    if (_.key.length !== target.length) return false;
    return _.key.every((item, index) => {
      return item === target[index];
    });
  }, []);

  useEffect(() => {
    if (timeout !== undefined) return;
    if (interval !== undefined) return;
    if (!_enabled) return;
    if (isKeyEqual(_key)) return;

    _.key = [..._key];
    _fetchData();
  }, [_fetchData, _enabled, timeout, interval, ..._key]);

  useEffect(() => {
    if (timeout === undefined) return;
    if (interval !== undefined) return;
    if (!_enabled) return;
    if (isKeyEqual(_key)) return;

    const timeoutId = setTimeout(() => {
      _.key = [..._key];
      _fetchData();
    }, timeout);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [_fetchData, _enabled, timeout, interval, ..._key]);

  useEffect(() => {
    if (interval === undefined) return;
    if (timeout !== undefined) return;
    if (!_enabled) return;

    const intervalId = setInterval(() => {
      _fetchData();
    }, interval);

    return () => {
      clearInterval(intervalId);
    };
  }, [_fetchData, _enabled, timeout, interval]);

  return { data, fetchData };
};

export { useFetch };
