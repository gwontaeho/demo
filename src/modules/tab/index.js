import { useRef, useReducer } from "react";

const uuid = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    const random = (Math.random() * 16) | 0;
    const value = char === "x" ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
};

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

const makeSchema = (schema) => {
  const activeIndex = Math.max(
    schema.findIndex(({ active }) => {
      return active === true;
    }),
    0
  );

  return schema.map((item, index) => {
    const { visible = true, disabled = false } = item;
    return { ...item, active: index === activeIndex, visible, disabled };
  });
};

const useTab = (params = {}) => {
  const { defaultSchema } = params;

  const _useTab = useRef(
    new (class {
      schema = { _useTab: this };

      #schema = makeSchema(cloneDeep(defaultSchema));
      #renderTab = null;

      initialize = (forceUpdate) => {
        if (this.#renderTab !== forceUpdate) {
          this.#renderTab = forceUpdate;
        }
      };

      getSchema = () => {
        return cloneDeep(this.#schema);
      };

      setSchema = (schema) => {
        this.#schema = makeSchema(cloneDeep(schema));
        this.#renderTab?.();
      };

      setVisible = (target, value) => {
        if (this.#schema[target].visible === value) return;
        this.#schema[target].visible = value;
        this.#renderTab?.();
      };

      setDisabled = (target, value) => {
        if (this.#schema[target].disabled === value) return;
        this.#schema[target].disabled = value;
        this.#renderTab?.();
      };

      setActive = (target) => {
        if (this.getActive() === target) return;
        for (const index in this.#schema) {
          this.#schema[index].active = Number(index) === target;
        }
        this.#renderTab?.();
      };

      getActive = () => {
        return this.#schema.findIndex(({ active }) => {
          return active === true;
        });
      };
    })()
  ).current;

  return _useTab;
};

const Tab = ({ _useTab, children }) => {
  const { initialize, getActive, getSchema, setActive } = _useTab;
  const _tab = useRef({ key: uuid() }).current;
  const forceUpdate = useReducer(() => ({}))[1];
  initialize(forceUpdate);

  const active = getActive();
  const schema = getSchema();

  const panel = children[active];

  return (
    <div>
      <div role="tablist" className="border-b">
        {schema.map(({ name, active, visible, disabled }, index) => {
          if (!visible) return null;
          return (
            <button
              role="tab"
              type="button"
              disabled={disabled}
              key={`${_tab.key}:${index}`}
              onClick={() => setActive(index)}
              className={
                "rounded-t border border-b-2 h-8 px-4" +
                (active ? " border-black" : " border-transparent") +
                (disabled ? " text-gray-400" : "")
              }
            >
              {name}
            </button>
          );
        })}
      </div>
      <div className="p-4">{panel}</div>
    </div>
  );
};

const Panel = ({ children }) => {
  return <>{children}</>;
};

Tab.Panel = Panel;

export { Tab, useTab };
