import { createContext, useContext, useEffect, useRef } from "react";

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

const ResourceContext = createContext(
  new (class {
    #resources = {};

    initialize = (parmas) => {
      parmas.forEach((item) => {
        const { key } = item;
        if (!this.#resources[key]) {
          this.fetchResource(key);
        }
      });
    };

    getResource = (key) => {
      return cloneDeep(this.#resources[key]);
    };

    fetchResource = async (key) => {
      try {
        const response = await new Promise((resolve) => {
          setTimeout(() => {
            resolve({ key, value: [] });
          }, 1000);
        });
        console.log(response);
      } catch (error) {}
    };
  })()
);

const useResource = (params) => {
  const { initialize, getResource } = useContext(ResourceContext);
  if (Array.isArray(params)) initialize(params);
  return { getResource };
};

export { useResource };
