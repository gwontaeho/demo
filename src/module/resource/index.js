import { createContext, useContext, useRef } from "react";

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

const ResourceContext = createContext();

const ResourceProvider = ({ children }) => {
  const _resource = useRef(
    new (class {
      #resources = {};

      initialize = (params) => {
        params.forEach(async (item) => {
          const { key } = item;
          if (this.#resources[key] === undefined) {
            this.#resources[key] = this.#createResource(key);
            const { value, status } = await this.#fetchResource(key);
            this.#setResource(key, value, status);
          } else if (this.#resources[key].status !== "pending" && false) {
            // 갱신 필요시
            this.#resources[key].status = "pending";
            Object.assign(this.#resources[key], createPromise());
            const { value, status } = await this.#fetchResource(key);
            this.#setResource(key, value, status);
          }
        });
      };

      #createResource = (key) => {
        return Object.assign(
          {
            key,
            value: null,
            updatedAt: null,
            status: "pending",
          },
          this.#createPromise()
        );
      };

      #createPromise = () => {
        let promise;
        let resolve;
        promise = new Promise((_) => {
          resolve = _;
        });
        return { promise, resolve };
      };

      #setResource = (key, value, status) => {
        switch (status) {
          case "fulfilled": {
            this.#resources[key].value = value;
            this.#resources[key].status = status;
            this.#resources[key].updatedAt = new Date().getTime();
            this.#resources[key].resolve();
            break;
          }
          case "rejected": {
            this.#resources[key].status = status;
            this.#resources[key].resolve();
            break;
          }
        }
      };

      #fetchResource = async (key) => {
        let value;
        let status;
        try {
          const _ = await new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve([]);
            }, 1000);
          });
          value = _;
          status = "fulfilled";
        } catch (error) {
          status = "rejected";
        }
        return { key, value, status };
      };

      getResource = async (key) => {
        // 타임아웃 추가해야함
        // Promise.race()를 사용하여 timeout
        await this.#resources[key].promise;
        return cloneDeep(this.#resources[key]);
      };
    })()
  ).current;

  return (
    <ResourceContext.Provider value={_resource}>
      {children}
    </ResourceContext.Provider>
  );
};

const useResource = (params) => {
  const { initialize, getResource } = useContext(ResourceContext);
  if (Array.isArray(params)) initialize(params);
  return { getResource };
};

export { ResourceProvider, useResource };
