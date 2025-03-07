import { useRef, useReducer, useState, forwardRef, useEffect } from "react";

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

  const _tab = useRef(null);
  const _useTab = useRef({
    ref: (param) => {
      _tab.current = { ...param };
    },
    setActive: (...params) => {
      _tab.current?.setActive?.(...params);
    },
    setVisible: (...params) => {
      _tab.current?.setVisible?.(...params);
    },
    setDisabled: (...params) => {
      _tab.current?.setDisabled?.(...params);
    },
  });

  return { ..._useTab.current };
};

const Tab = forwardRef((props, ref) => {
  const { children } = props;

  const [activeItem, setActiveItem] = useState(0);
  const [visibleItems, setVisibleItems] = useState([]);
  const [disabledItems, setDisabledItems] = useState([]);

  const [schema, setSchema] = useState(() => {
    return makeSchema(children.map(({ props: { name = "" } }) => ({ name })));
  });

  const _tab = useRef({
    key: uuid(),
    setActive: (index) => {
      setActiveItem(index);
    },
    setVisible: (index, value) => {
      setVisibleItems((prev) => {
        if (value && !prev.includes(index)) {
          return [...prev, index];
        } else if (!value && prev.includes(index)) {
          return prev.filter((item) => !item);
        } else {
          return prev;
        }
      });
    },
    setDisabled: (index, value) => {
      setDisabledItems((prev) => {
        if (value && !prev.includes(index)) {
          return [...prev, index];
        } else if (!value && prev.includes(index)) {
          return prev.filter((item) => !item);
        } else {
          return prev;
        }
      });
    },
  });

  useEffect(() => {
    if (typeof ref === "function") {
      const { key, ...rest } = _tab.current;
      ref(rest);
    }
  }, []);

  const panel = children[activeItem];

  return (
    <div>
      <div role="tablist" className="border-b">
        {schema.map(({ name }, index) => {
          if (visibleItems.includes(index)) return null;
          const active = activeItem === index;
          const disabled = disabledItems.includes(index);
          return (
            <button
              role="tab"
              type="button"
              disabled={disabled}
              key={`${_tab.current.key}:${index}`}
              onClick={() => _tab.current.setActive(index)}
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
