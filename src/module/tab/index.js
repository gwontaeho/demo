import { useRef, useState, forwardRef, useEffect } from "react";

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

const useTab = (params = {}) => {
  const { defaultSchema } = params;

  const _data = useRef(null);
  _data.current ??= (() => {
    let active = 0;
    let name = [];
    let hidden = [];
    let disabled = [];
    if (defaultSchema) {
      defaultSchema.forEach((item, index) => {
        if (item.active) active = index;
        if (item.name) name.push(item.name);
        if (item.hidden) hidden.push(index);
        if (item.disabled) disabled.push(index);
      });
    }
    return { name, active, hidden, disabled };
  })();

  const _tab = useRef(null);
  const _useTab = useRef({
    ref: (param) => {
      if (param === undefined) {
        return _data.current;
      }
      _tab.current = { ...param };
    },
    setActive: (...params) => {
      _tab.current?.setActive?.(...params);
    },
    setHidden: (...params) => {
      _tab.current?.setHidden?.(...params);
    },
    setDisabled: (...params) => {
      _tab.current?.setDisabled?.(...params);
    },
  });

  return { ..._useTab.current };
};

const Tab = forwardRef((props, ref) => {
  const { children } = props;

  const _data = useRef(null);
  if (_data.current === null && typeof ref === "function") {
    _data.current = ref();
  }

  const [activeItem, setActiveItem] = useState(_data.current.active);
  const [hiddenItems, setHiddenItems] = useState(_data.current.hidden);
  const [disabledItems, setDisabledItems] = useState(_data.current.disabled);

  const [schema] = useState(
    () => _data.current.name ?? children.map(({ props: { name = "" } }) => name)
  );

  const _tab = useRef({
    key: crypto.randomUUID(),
    setActive: (index) => {
      _data.current.active = index;
      setActiveItem(index);
    },
    setHidden: (index, value) => {
      setHiddenItems((prev) => {
        if (value && !prev.includes(index)) {
          return (_data.current.hidden = [...prev, index]);
        } else if (!value && prev.includes(index)) {
          return (_data.current.hidden = prev.filter((item) => item !== index));
        } else {
          return prev;
        }
      });
    },
    setDisabled: (index, value) => {
      setDisabledItems((prev) => {
        if (value && !prev.includes(index)) {
          return (_data.current.disabled = [...prev, index]);
        } else if (!value && prev.includes(index)) {
          return (_data.current.disabled = prev.filter(
            (item) => item !== index
          ));
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
        {schema.map((name, index) => {
          if (hiddenItems.includes(index)) return null;
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
