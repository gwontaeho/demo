import { useRef, useState, useMemo } from "react";
import { Icon } from "../icon";

const useTree = () => {
  const _useTree = useRef(
    new (class {
      #schema = {};

      openTree = () => {};
      closeTree = () => {};
    })()
  ).current;

  return {};
};

const TreeItem = (props) => {
  const {
    flat,
    itemKey,
    label,
    children,
    expanded,
    checked,
    toggleExpanded,
    toggleChecked,
  } = props;

  return (
    <li
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
      <div className="p-1 flex items-center gap-1 cursor-pointer hover:bg-gray-50">
        <div className="w-5 h-5 flex items-center justify-center">
          {children && (
            <button
              type="button"
              className="p-1 rounded-full hover:bg-gray-100"
              onClick={(event) => {
                event.stopPropagation();
                toggleExpanded(itemKey);
              }}
            >
              <Icon name="right" />
            </button>
          )}
        </div>

        <div className="w-5 h-5 flex items-center justify-center">
          <input
            type="checkbox"
            checked={checked.has(itemKey)}
            onChange={() => toggleChecked(itemKey)}
          />
        </div>
        <span className="text-sm">{label}</span>
      </div>
      {children && expanded.has(itemKey) && (
        <ul className="px-2">
          {children.map((item) => {
            return (
              <TreeItem
                {...item}
                flat={flat}
                itemKey={item.key}
                expanded={expanded}
                checked={checked}
                toggleExpanded={toggleExpanded}
                toggleChecked={toggleChecked}
              />
            );
          })}
        </ul>
      )}
    </li>
  );
};

const Tree = (props) => {
  const { data } = props;

  const list = useMemo(() => data, []);
  const flat = useMemo(() => {
    const flat = (ary, parent = []) => {
      return ary.reduce((prev, curr) => {
        const item = { ...curr };
        item.parent = parent;
        if (item.children) {
          const result = flat(item.children, [...parent, item.key]);
          prev.push(...result);
        }
        prev.push(item);
        return prev;
      }, []);
    };
    return flat(list);
  }, []);

  const [expanded, setExpanded] = useState(() => new Set());
  const [checked, setChecked] = useState(() => new Set());

  const toggleExpanded = (key) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const toggleChecked = (key) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  return (
    <ul>
      {list.map((item) => {
        return (
          <TreeItem
            {...item}
            flat={flat}
            itemKey={item.key}
            expanded={expanded}
            checked={checked}
            toggleExpanded={toggleExpanded}
            toggleChecked={toggleChecked}
          />
        );
      })}
    </ul>
  );
};

export { Tree, useTree };
