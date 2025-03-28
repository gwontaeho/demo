import { useEffect, useRef, useState, useCallback } from "react";

/**
 * @typedef {Object} UseFetchConfig
 * @property {Function} [fetcher]
 * @property {Function} [formatter]
 * @property {Function} [onSuccess]
 * @property {Function} [onError]
 * @property {boolean} [enabled]
 * @property {boolean} [enabledTimeout]
 * @property {boolean} [enabledInterval]
 * @property {number} [timeout]
 * @property {number} [interval]
 * @property {any[]} [key]
 */

/**
 * @param {UseFetchConfig} config
 * @returns
 */
const useFetch = (config = {}) => {
  const {
    fetcher,
    formatter,
    onSuccess,
    onError,
    enabled,
    enabledTimeout,
    enabledInterval,
    timeout,
    interval,
    key,
  } = config;

  const _enabled = !!enabled;
  const _key = Array.isArray(key) ? key : [key];

  const [data, setData] = useState(null);

  const _ = useRef({
    key: [window.crypto.randomUUID()],
    data: null,
    timeoutId: null,
    intervalId: null,
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

  const _isKeyEqual = useCallback((target) => {
    if (_.key.length !== target.length) return false;
    return _.key.every((item, index) => {
      return item === target[index];
    });
  }, []);

  useEffect(() => {
    if (timeout !== undefined) return;
    if (interval !== undefined) return;
    if (!_enabled) return;
    if (_isKeyEqual(_key)) return;

    _.key = [..._key];
    _fetchData();
  }, [_fetchData, _enabled, timeout, interval, ..._key]);

  // Timout
  useEffect(() => {
    if (timeout === undefined) return;
    if (interval !== undefined) return;
    if (!enabledTimeout) return;

    _.timeoutId = window.setTimeout(() => {
      _fetchData();
    }, timeout);

    return () => {
      if (_.timeoutId !== null) {
        window.clearTimeout(_.timeoutId);
      }
    };
  }, [enabledTimeout]);

  // Interval
  useEffect(() => {
    if (interval === undefined) return;
    if (timeout !== undefined) return;
    if (!enabledInterval) return;

    _.intervalId = window.setInterval(() => {
      _fetchData();
    }, interval);

    return () => {
      if (_.intervalId !== null) {
        window.clearInterval(_.intervalId);
      }
    };
  }, [enabledInterval]);

  const startTimeout = useCallback(() => {
    if (_.timeoutId !== null) {
      window.clearTimeout(_.timeoutId);
    }

    _.timeoutId = window.setTimeout(() => {
      _fetchData();
    }, timeout);
  }, [_fetchData, timeout]);

  const stopTimeout = useCallback(() => {
    if (_.timeoutId !== null) {
      window.clearTimeout(_.timeoutId);
    }
  }, []);

  const startInterval = useCallback(() => {
    if (_.intervalId !== null) {
      window.clearInterval(_.intervalId);
    }

    _.intervalId = window.setInterval(() => {
      _fetchData();
    }, interval);
  }, [_fetchData, interval]);

  const stopInterval = useCallback(() => {
    if (_.intervalId !== null) {
      window.clearInterval(_.intervalId);
    }
  }, []);

  return {
    data,
    fetchData,
    startTimeout,
    stopTimeout,
    startInterval,
    stopInterval,
  };
};

export { useFetch };
