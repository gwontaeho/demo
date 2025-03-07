import { useRef, useReducer, useState, forwardRef } from "react";

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
  return schema.map((item, index) => {
    const { visible = true, disabled = false } = item;
    return {
      ...item,
      visible,
      disabled,
      active:
        index ===
        Math.max(
          schema.findIndex(({ active }) => {
            return active === true;
          }),
          0
        ),
    };
  });
};

const useTab = (params = {}) => {
  const { defaultSchema } = params;
  const _useTab = useRef(null);
  if (_useTab.current === null) {
    _useTab.current = new (class {
      #schema = makeSchema(cloneDeep(defaultSchema));
      #renderTab = null;

      ref = (forceUpdate) => {
        if (this.#renderTab !== forceUpdate) {
          this.#renderTab = forceUpdate;
        }
        return this;
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
    })();
  }

  return { ..._useTab.current };
};

const Tab = forwardRef(({ children }, ref) => {
  const forceUpdate = useReducer(() => ({}))[1];
  const _tab = useRef({ key: uuid() });
  const _useTab = useRef(null);
  if (_useTab.current === null) {
    if (typeof ref === "function") {
      _useTab.current = ref(forceUpdate);
    }
  }

  const schema = _useTab.current.getSchema();
  const panel = children[_useTab.current.getActive()];

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
              key={`${_tab.current.key}:${index}`}
              onClick={() => _useTab.current.setActive(index)}
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
});

const Panel = ({ children }) => {
  return <>{children}</>;
};

Tab.Panel = Panel;

export { Tab, useTab };
